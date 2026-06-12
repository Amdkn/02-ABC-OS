'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { HubLayout } from '@/components/HubLayout';

export interface Chapter {
  id: string;
  title: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  category: string;
  title: string;
  sub: string;
  desc: string;
  progress: number;
  icon: string;
  accent: string;
  lessonsCount: number;
  duration: string;
  modules: Module[];
}

export interface Category {
  id: string;
  title: string;
  desc: string;
  icon: string;
  accent: string;
}

interface LearnHubClientPageProps {
  initialCategories: Category[];
  initialCourses: Course[];
}

export default function LearnHubClientPage({
  initialCategories,
  initialCourses,
}: LearnHubClientPageProps) {
  const t = useTranslations('hubs.learn');

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // 1. Filtrage global par recherche
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return initialCourses;
    const q = searchQuery.toLowerCase();
    return initialCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.sub.toLowerCase().includes(q)
    );
  }, [searchQuery, initialCourses]);

  // 2. Cours en cours (progression > 0)
  const myCourses = useMemo(() => {
    return filteredCourses.filter((c) => c.progress > 0);
  }, [filteredCourses]);

  // 3. Catégorie sélectionnée
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return initialCategories.find((cat) => cat.id === selectedCategoryId) || null;
  }, [selectedCategoryId, initialCategories]);

  // 4. Cours de la catégorie sélectionnée
  const categoryCourses = useMemo(() => {
    if (!selectedCategoryId) return [];
    return filteredCourses.filter((c) => c.category === selectedCategoryId);
  }, [selectedCategoryId, filteredCourses]);

  // 5. Cours sélectionné pour affichage des détails
  const selectedCourse = useMemo(() => {
    if (!selectedCourseId) return null;
    return initialCourses.find((c) => c.id === selectedCourseId) || null;
  }, [selectedCourseId, initialCourses]);

  // Configuration des onglets avec compteurs dynamiques
  const tabs: [string, string | null][] = useMemo(() => {
    const myCount = initialCourses.filter((c) => c.progress > 0).length;
    return [
      [t('myCourses'), myCount > 0 ? String(myCount) : null],
      [t('tracks'), null],
      [t('certificates'), null],
    ];
  }, [initialCourses, t]);

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setSelectedCourseId(null);
    setSelectedCategoryId(null);
    setSearchQuery('');
  };

  const categoryLabel = (cat: string): string => {
    if (cat === 'structuration') return 'Structuration';
    if (cat === 'agentic') return 'Agentic Architecture';
    if (cat === 'autodidact') return 'Self-Directed';
    if (cat === 'productivity') return 'Productivity';
    if (cat === 'solarpunk') return 'Solarpunk';
    return cat;
  };

  return (
    <HubLayout
      hubKey="learn"
      tabs={tabs}
      searchPlaceholder={
        selectedCourseId
          ? t('searchInCourse')
          : selectedCategoryId
            ? t('searchInCategory')
            : t('searchPlaceholder')
      }
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {/* ── VUE 1 : DÉTAILS D'UN COURS ────────────────────────────────── */}
      {selectedCourse && (
        <div className="course-detail animate-fadeIn">
          {/* Fil d'Ariane & Retour */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setSelectedCourseId(null)}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--line)] bg-[var(--card)] hover:bg-neutral-800/10 text-[var(--ink-soft)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 text-[var(--ink-faint)]">
              <span className="cursor-pointer hover:underline" onClick={() => { setSelectedCourseId(null); setSelectedCategoryId(null); setActiveTab(1); }}>{t('tracks')}</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="cursor-pointer hover:underline" onClick={() => { setSelectedCourseId(null); setSelectedCategoryId(selectedCourse.category); }}>{categoryLabel(selectedCourse.category)}</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-[var(--ink)] truncate max-w-[150px]">{selectedCourse.title}</span>
            </div>
          </div>

          {/* En-tête du cours */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] mb-6 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
            <div className="flex items-start gap-4 min-w-0">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${selectedCourse.accent} 15%, transparent)`, color: selectedCourse.accent }}
              >
                <span className="material-symbols-outlined text-[28px]">{selectedCourse.icon}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: selectedCourse.accent }}>
                  {selectedCourse.sub}
                </span>
                <h1 className="text-xl md:text-2xl font-bold mt-1 text-[var(--ink)]">{selectedCourse.title}</h1>
                <p className="text-[13.5px] mt-1.5 text-[var(--ink-soft)] leading-relaxed max-w-2xl">{selectedCourse.desc}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto items-stretch md:items-end">
              <div className="text-xs font-semibold text-[var(--ink-faint)]">
                {t('lessonsCount', { count: selectedCourse.lessonsCount })} · {selectedCourse.duration}
              </div>
              <button
                className="btn py-2 px-5 rounded-xl font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all text-center text-[13.5px]"
                style={{ background: `linear-gradient(135deg, ${selectedCourse.accent}, color-mix(in srgb, ${selectedCourse.accent} 75%, #000))` }}
              >
                {selectedCourse.progress > 0 ? t('resumeCourse') : t('startCourse')}
              </button>
            </div>
          </div>

          {/* Barre de progression si déjà commencé */}
          {selectedCourse.progress > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] mb-6 flex items-center justify-between gap-5">
              <div className="flex-1">
                <span className="text-xs font-bold text-[var(--ink-faint)] block mb-1">{t('yourProgress')}</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-neutral-800/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${selectedCourse.progress}%`, background: selectedCourse.accent }}
                    />
                  </div>
                  <span className="text-sm font-bold" style={{ color: selectedCourse.accent }}>{selectedCourse.progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Programme détaillé */}
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--ink)]">
            <span className="material-symbols-outlined text-[20px] text-[var(--ink-faint)]">toc</span>
            {t('programTitle')}
          </h2>

          <div className="flex flex-col gap-4">
            {selectedCourse.modules.map((mod, modIdx) => (
              <div key={mod.id} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden">
                {/* En-tête Module */}
                <div className="p-4 border-b border-[var(--line)] bg-neutral-800/5 flex justify-between items-center">
                  <span className="font-bold text-sm text-[var(--ink)]">{mod.title}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-800/10 text-[var(--ink-soft)]">
                    {t('chapterCount', { count: mod.chapters.length })}
                  </span>
                </div>

                {/* Chapitres */}
                <div className="divide-y divide-[var(--line)]">
                  {mod.chapters.map((chap, chapIdx) => {
                    const isCompleted = selectedCourse.progress > (modIdx * 30 + chapIdx * 12);
                    return (
                      <div key={chap.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-800/5 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCompleted
                                ? 'text-white'
                                : 'border border-[var(--line)] text-[var(--ink-faint)]'
                            }`}
                            style={isCompleted ? { background: selectedCourse.accent } : {}}
                          >
                            {isCompleted ? (
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            ) : (
                              chapIdx + 1
                            )}
                          </div>
                          <span className="text-[13.5px] font-medium text-[var(--ink)] truncate">{chap.title}</span>
                        </div>
                        <span className="text-xs text-[var(--ink-faint)] flex-shrink-0">{chap.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VUE 2 : ONGLET 0 - MES COURS ──────────────────────────────── */}
      {!selectedCourse && activeTab === 0 && (
        <div className="my-courses-tab animate-fadeIn">
          <div className="hd flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">My courses in progress</h2>
          </div>

          {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className="hcard p-5 cursor-pointer flex gap-4 hover:scale-[1.01] active:scale-[0.99] transition-all border border-[var(--line)] bg-[var(--card)] rounded-3xl"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${course.accent} 15%, transparent)`, color: course.accent }}
                  >
                    <span className="material-symbols-outlined text-[24px]">{course.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] tracking-wider uppercase font-bold" style={{ color: course.accent }}>
                        {course.sub}
                      </div>
                      <h3 className="text-[15px] font-bold text-[var(--ink)] mt-1 truncate">{course.title}</h3>
                      <p className="text-[12px] text-[var(--ink-soft)] mt-1 line-clamp-2 leading-relaxed">{course.desc}</p>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1 text-[11px] font-semibold text-[var(--ink-faint)]">
                        <span>{t('lessonsCount', { count: course.lessonsCount })}</span>
                        <span style={{ color: course.accent }}>{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-800/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${course.progress}%`, background: course.accent }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-dashed border-[var(--line)] text-center bg-[var(--card)]">
              <span className="material-symbols-outlined text-[40px] text-[var(--ink-faint)] mb-2">school</span>
              <p className="text-[14px] text-[var(--ink-soft)] font-medium">{t('noCourses')}</p>
              <button
                onClick={() => setActiveTab(1)}
                className="mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white bg-[var(--learn-green)] hover:opacity-90 active:scale-95 transition-all"
              >
                {t('exploreTracks')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── VUE 3 : ONGLET 1 - PARCOURS ───────────────────────────────── */}
      {!selectedCourse && activeTab === 1 && (
        <div className="explore-tab animate-fadeIn">
          {/* Sous-vue : Liste des cours d'une catégorie */}
          {selectedCategoryId ? (
            <div>
              {/* Retour à la liste des catégories */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--line)] bg-[var(--card)] hover:bg-neutral-800/10 text-[var(--ink-soft)] transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 text-[var(--ink-faint)]">
                  <span className="cursor-pointer hover:underline" onClick={() => setSelectedCategoryId(null)}>{t('tracks')}</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span className="text-[var(--ink)]">{activeCategory?.title}</span>
                </div>
              </div>

              {activeCategory && (
                <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--line)] mb-5" style={{ borderLeft: `4px solid ${activeCategory.accent}` }}>
                  <h2 className="font-bold text-lg text-[var(--ink)]">{activeCategory.title}</h2>
                  <p className="text-xs text-[var(--ink-soft)] mt-1">{activeCategory.desc}</p>
                </div>
              )}

              {/* Grid des cours de la catégorie */}
              {categoryCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryCourses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className="hcard p-5 cursor-pointer flex gap-4 hover:scale-[1.01] active:scale-[0.99] transition-all border border-[var(--line)] bg-[var(--card)] rounded-3xl"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `color-mix(in srgb, ${course.accent} 15%, transparent)`, color: course.accent }}
                      >
                        <span className="material-symbols-outlined text-[22px]">{course.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-[14.5px] text-[var(--ink)] truncate">{course.title}</h3>
                          {course.progress > 0 && (
                            <span
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                              style={{ background: `color-mix(in srgb, ${course.accent} 15%, transparent)`, color: course.accent }}
                            >
                              {course.progress}%
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[var(--ink-soft)] mt-1.5 line-clamp-2 leading-relaxed">{course.desc}</p>
                        <div className="mt-3 flex justify-between items-center text-[11px] text-[var(--ink-faint)] font-medium">
                          <span>{t('lessonsCount', { count: course.lessonsCount })}</span>
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[var(--ink-soft)] bg-[var(--card)] border border-[var(--line)] rounded-3xl">
                  {t('noCategory')}
                </div>
              )}
            </div>
          ) : (
            /* Liste des catégories (Parcours) */
            <div>
              <h2 className="text-lg font-bold mb-4 text-[var(--ink)]">Our learning tracks</h2>
              <div className="flex flex-col gap-4">
                {initialCategories.map((cat) => {
                  const count = initialCourses.filter((c) => c.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="p-5 cursor-pointer border border-[var(--line)] bg-[var(--card)] rounded-3xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-between gap-5"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `color-mix(in srgb, ${cat.accent} 15%, transparent)`, color: cat.accent }}
                        >
                          <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[15.5px] text-[var(--ink)]">{cat.title}</h3>
                          <p className="text-[12.5px] text-[var(--ink-soft)] mt-1 leading-normal">{cat.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-800/5 text-[var(--ink-soft)]">
                          {count} courses
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-[var(--ink-faint)]">chevron_right</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── VUE 4 : ONGLET 2 - CERTIFICATS ────────────────────────────── */}
      {!selectedCourse && activeTab === 2 && (
        <div className="certificates-tab animate-fadeIn p-6 rounded-3xl border border-[var(--line)] bg-[var(--card)] text-center">
          <span className="material-symbols-outlined text-[48px] text-[var(--brand-gold)] mb-3">workspace_premium</span>
          <h2 className="font-bold text-lg text-[var(--ink)] mb-1.5">{t('certificationsTitle')}</h2>
          <p className="text-[13px] text-[var(--ink-soft)] leading-relaxed max-w-md mx-auto mb-4">
            {t('certificationsBody')}
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-neutral-800/5 text-[var(--ink-soft)] border border-[var(--line)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {t('certCount')}
          </div>
        </div>
      )}
    </HubLayout>
  );
}
