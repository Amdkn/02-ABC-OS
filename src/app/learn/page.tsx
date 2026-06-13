import { createServerClient } from '@/lib/supabase/server';
import LearnHubClientPage, { Category, Course } from './LearnHubClientPage';
import { LEARN_CATEGORIES, LEARN_COURSES } from '@/data/learnData';
import { withTimeout, QueryTimeoutError } from '@/lib/supabase/with-timeout';
import { unstable_cache } from 'next/cache';

export const revalidate = 60;

interface DBCategory {
  id: string;
  title: string;
  desc?: string | null;
  icon?: string | null;
  accent?: string | null;
}

interface DBChapter {
  id: string;
  title: string;
  duration?: string | null;
  sort_order: number;
}

interface DBModule {
  id: string;
  title: string;
  sort_order: number;
  chapters?: DBChapter[] | null;
}

interface DBCourse {
  id: string;
  category_id: string;
  title: string;
  sub?: string | null;
  desc?: string | null;
  progress: number;
  icon?: string | null;
  accent?: string | null;
  lessons_count: number;
  duration?: string | null;
  sort_order: number;
  modules?: DBModule[] | null;
}

const QUERY_TIMEOUT_MS = 3000;

const loadLearnData = unstable_cache(
  async (): Promise<{ categories: DBCategory[]; courses: DBCourse[] } | null> => {
    try {
      const supabase = await createServerClient();

      const safeQuery = <T,>(p: PromiseLike<T>): Promise<T> =>
        withTimeout(p, QUERY_TIMEOUT_MS).catch((err: unknown) => {
          if (!(err instanceof QueryTimeoutError)) console.warn('[learn] query failed:', err);
          return null as T;
        });

      const [dbCategoriesRes, dbCoursesRes] = await Promise.all([
        safeQuery(supabase.from('learn_categories').select('*').order('sort_order', { ascending: true })),
        safeQuery(
          supabase
            .from('learn_courses')
            .select(`
              id,
              category_id,
              title,
              sub,
              desc,
              progress,
              icon,
              accent,
              lessons_count,
              duration,
              sort_order,
              modules:learn_modules (
                id,
                title,
                sort_order,
                chapters:learn_chapters (
                  id,
                  title,
                  duration,
                  sort_order
                )
              )
            `)
            .order('sort_order', { ascending: true })
        ),
      ]);

      if (!dbCategoriesRes || !dbCoursesRes) return null;
      const dbCategories = (dbCategoriesRes as { data: unknown }).data as DBCategory[] | null;
      const dbCourses = (dbCoursesRes as { data: unknown }).data as DBCourse[] | null;
      return {
        categories: (dbCategories as DBCategory[]) || [],
        courses: (dbCourses as DBCourse[]) || [],
      };
    } catch (err: unknown) {
      console.error('[learn] cached fetch failed:', err);
      return null;
    }
  },
  ['learn-catalog-v1'],
  { revalidate: 60, tags: ['learn'] }
);

export default async function LearnHubPage() {
  let categories: Category[] = LEARN_CATEGORIES;
  let courses: Course[] = LEARN_COURSES;

  try {
    const raw = await loadLearnData();
    if (raw) {
      categories = raw.categories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        desc: cat.desc || '',
        icon: cat.icon || '',
        accent: cat.accent || '',
      }));

      courses = raw.courses.map((course) => {
        const sortedModules = (course.modules || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((mod) => ({
            id: mod.id,
            title: mod.title,
            chapters: (mod.chapters || [])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((ch) => ({
                id: ch.id,
                title: ch.title,
                duration: ch.duration || '',
              })),
          }));

        return {
          id: course.id,
          category: course.category_id,
          title: course.title,
          sub: course.sub || '',
          desc: course.desc || '',
          progress: course.progress,
          icon: course.icon || '',
          accent: course.accent || '',
          lessonsCount: course.lessons_count,
          duration: course.duration || '',
          modules: sortedModules,
        };
      });
    }
  } catch (err: unknown) {
    console.error('[learn] fatal fallback:', err);
  }

  return <LearnHubClientPage initialCategories={categories} initialCourses={courses} />;
}
