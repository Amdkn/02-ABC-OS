import { createServerClient } from '@/lib/supabase/server';
import LearnHubClientPage, { Category, Course } from './LearnHubClientPage';

export const revalidate = 0; // Pas de mise en cache statique pour ce tableau de bord dynamique

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

export default async function LearnHubPage() {
  const supabase = await createServerClient();

  // 1. Récupération des catégories ordonnées
  const { data: dbCategories } = await supabase
    .from('learn_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // 2. Récupération des cours avec la hiérarchie imbriquée (modules > chapitres)
  const { data: dbCourses } = await supabase
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
    .order('sort_order', { ascending: true });

  // 3. Mapping vers les types attendus par l'UI Client
  const categories: Category[] = ((dbCategories as unknown as DBCategory[]) || []).map((cat) => ({
    id: cat.id,
    title: cat.title,
    desc: cat.desc || '',
    icon: cat.icon || '',
    accent: cat.accent || '',
  }));

  const courses: Course[] = ((dbCourses as unknown as DBCourse[]) || []).map((course) => {
    // Tri local des modules et chapitres pour garantir l'ordre chronologique
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

  return (
    <LearnHubClientPage
      initialCategories={categories}
      initialCourses={courses}
    />
  );
}
