'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { HubLayout } from '@/components/HubLayout';
import { Avatar } from '@/components/Avatar';

export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: string | null;
}

export interface SpotlightProject {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  place: string | null;
  ms: number;
  msTotal: number;
  pct: number;
  team: { name: string; tint: string }[];
}

// --- Build Hub v2 catalog types (D10 shared catalog, ADR-ABCOS-001) ---
export interface BuildTask {
  id: string;
  title: string;
  duration: string;
}

export interface BuildPhase {
  id: string;
  title: string;
  tasks: BuildTask[];
}

export interface BuildProject {
  id: string;
  categoryId: string;
  title: string;
  sub: string;
  desc: string;
  progress: number;
  icon: string;
  accent: string;
  tasksCount: number;
  duration: string;
  phases: BuildPhase[];
}

export interface BuildCategory {
  id: string;
  title: string;
  desc: string;
  icon: string;
  accent: string;
}

interface BuildHubClientPageProps {
  projects: SpotlightProject[];
  milestones: Milestone[];
  categories: BuildCategory[];
  catalogProjects: BuildProject[];
}

export default function BuildHubClientPage({
  projects,
  milestones,
  categories,
  catalogProjects,
}: BuildHubClientPageProps) {
  const t = useTranslations('hubs.build');

  const tabs: [string, string | null][] = [
    [t('tabs.myProjects'), projects.length > 0 ? String(projects.length) : null],
    [t('tabs.coopTools'), null],
  ];

  const activeProject = projects.find(p => p.name === 'Solaris Agri-Coop') || projects[0];

  const getStatusLabel = (status: Milestone['status']): string => {
    switch (status) {
      case 'completed': return t('statusCompleted');
      case 'in_progress': return t('statusInProgress');
      case 'blocked': return t('statusBlocked');
      default: return t('statusPending');
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'var(--ok)';
      case 'in_progress': return 'var(--build-blue)';
      case 'blocked': return '#E06B5B';
      default: return 'var(--ink-faint)';
    }
  };

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totals = useMemo(() => {
    const phasesCount = catalogProjects.reduce((acc, p) => acc + p.phases.length, 0);
    const tasksCount = catalogProjects.reduce(
      (acc, p) => acc + p.phases.reduce((a, ph) => a + ph.tasks.length, 0),
      0,
    );
    return {
      categories: categories.length,
      projects: catalogProjects.length,
      phases: phasesCount,
      tasks: tasksCount,
    };
  }, [categories, catalogProjects]);

  return (
    <HubLayout
      hubKey="build"
      tabs={tabs}
      searchPlaceholder={t('searchPlaceholder')}
    >
      <div className="hsec px-0">

        {/* Main Project Progress Card */}
        {activeProject ? (
          <div className="hcard mb-4" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '15px 15px 0' }}>
              <span
                className="pill"
                style={{
                  background: 'color-mix(in srgb, var(--build-green) 18%, transparent)',
                  color: 'var(--build-green)',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '999px',
                    background: 'var(--build-green)',
                    marginRight: '6px',
                    display: 'inline-block',
                  }}
                ></span>
                {t('inProgress')}
              </span>
            </div>
            <div style={{ padding: '14px 15px 0' }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{activeProject.name}</h3>
              <p style={{ margin: '5px 0 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
                {activeProject.description || t('defaultProjectDesc')} · {activeProject.place}
              </p>
            </div>
            <div style={{ padding: '16px 15px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                <b>{t('milestonesProgress')}</b>
                <b style={{ color: 'var(--build-blue)' }}>{activeProject.ms} / {activeProject.msTotal}</b>
              </div>
              <div className="bar">
                <span style={{ width: `${activeProject.pct}%`, background: 'var(--build-blue)' }}></span>
              </div>
              <div className="stack" style={{ marginTop: '14px', display: 'flex', gap: '5px' }}>
                {activeProject.team.map((m, idx) => (
                  <Avatar key={idx} initials={m.name.substring(0, 2).toUpperCase()} color={m.tint} className="w-[30px] h-[30px]" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[var(--ink-soft)] bg-[var(--card)] border border-[var(--line)] rounded-3xl mb-4">
            {t('noProject')}
          </div>
        )}

        {/* Milestones Sections */}
        <div className="hsec px-0 mt-4">
          <div className="hd mb-3">
            <h2 className="text-lg font-bold">{t('nextMilestones')}</h2>
          </div>

          {milestones.length > 0 ? (
            <div className="flex flex-col gap-3">
              {milestones.map((ms) => (
                <div key={ms.id} className="hcard flex items-center gap-3">
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '13px',
                      display: 'grid',
                      placeItems: 'center',
                      background: `color-mix(in srgb, ${getStatusColor(ms.status)} 18%, transparent)`,
                      color: getStatusColor(ms.status),
                    }}
                  >
                    <span className="material-symbols-outlined">
                      {ms.status === 'completed' ? 'check_circle' : ms.status === 'blocked' ? 'warning' : 'water_drop'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{ms.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                      {ms.description || t('defaultMilestoneDesc')} {ms.dueDate ? `· ${t('dueDatePrefix')} ${ms.dueDate}` : ''}
                    </div>
                  </div>
                  <span
                    className="pill"
                    style={{
                      background: `color-mix(in srgb, ${getStatusColor(ms.status)} 20%, transparent)`,
                      color: getStatusColor(ms.status),
                    }}
                  >
                    {getStatusLabel(ms.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[var(--ink-soft)] bg-[var(--card)] border border-[var(--line)] rounded-3xl">
              {t('noMilestone')}
            </div>
          )}
        </div>

        {/* ============================================================
            CATALOGUE BUILD HUB v2 (D10 shared catalog, ADR-ABCOS-001)
            Hierarchy 4 levels : 5 categories > 17 projects > 48 phases > 141 tasks
            ============================================================ */}
        <div className="hsec px-0 mt-6">
          <div className="hd mb-3 flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-bold">{t('catalogTitle')}</h2>
              <p className="text-xs text-[var(--ink-soft)] mt-1">
                {t('catalogSubtitle')}
              </p>
            </div>
            <div
              className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--build-blue) 14%, transparent)',
                color: 'var(--build-blue)',
              }}
            >
              {t('totalsLabel', totals)}
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--ink-soft)] bg-[var(--card)] border border-[var(--line)] rounded-3xl">
              {t('loading')}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {categories.map((cat) => {
                const isExpanded = expandedCategories.has(cat.id);
                const catProjects = catalogProjects.filter((p) => p.categoryId === cat.id);
                return (
                  <div
                    key={cat.id}
                    className="rounded-3xl border border-[var(--line)] bg-[var(--card)] overflow-hidden"
                  >
                    {/* Category header (clickable) */}
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full p-5 flex items-center gap-4 text-left hover:bg-neutral-800/5 active:scale-[0.99] transition-all"
                      aria-expanded={isExpanded}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `color-mix(in srgb, ${cat.accent} 15%, transparent)`,
                          color: cat.accent,
                        }}
                      >
                        <span className="material-symbols-outlined text-[26px]">{cat.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[15.5px] text-[var(--ink)]">{cat.title}</h3>
                        <p className="text-[12.5px] text-[var(--ink-soft)] mt-1 leading-normal line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background: `color-mix(in srgb, ${cat.accent} 14%, transparent)`,
                            color: cat.accent,
                          }}
                        >
                          {t('projectsCount', { count: catProjects.length })}
                        </span>
                        <span
                          className="material-symbols-outlined text-[20px] text-[var(--ink-faint)] transition-transform"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          expand_more
                        </span>
                      </div>
                    </button>

                    {/* Projects (visible if category expanded) */}
                    {isExpanded && (
                      <div className="border-t border-[var(--line)] bg-neutral-800/[0.02] p-3 flex flex-col gap-2">
                        {catProjects.length === 0 ? (
                          <div className="p-4 text-center text-xs text-[var(--ink-soft)]">
                            {t('emptyCategory')}
                          </div>
                        ) : (
                          catProjects.map((proj) => {
                            const isProjExpanded = expandedProjects.has(proj.id);
                            return (
                              <div
                                key={proj.id}
                                className="rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden"
                              >
                                <button
                                  onClick={() => toggleProject(proj.id)}
                                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-neutral-800/5 active:scale-[0.99] transition-all"
                                  aria-expanded={isProjExpanded}
                                >
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{
                                      background: `color-mix(in srgb, ${proj.accent} 15%, transparent)`,
                                      color: proj.accent,
                                    }}
                                  >
                                    <span className="material-symbols-outlined text-[22px]">{proj.icon}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-bold tracking-wider uppercase" style={{ color: proj.accent }}>
                                      {proj.sub}
                                    </div>
                                    <h4 className="font-bold text-[14px] text-[var(--ink)] mt-0.5 truncate">
                                      {proj.title}
                                    </h4>
                                    <div className="mt-1 flex gap-3 text-[11px] text-[var(--ink-faint)] font-medium">
                                      <span>{t('tasksCount', { count: proj.tasksCount })}</span>
                                      <span>·</span>
                                      <span>{proj.duration}</span>
                                    </div>
                                  </div>
                                  <span
                                    className="material-symbols-outlined text-[18px] text-[var(--ink-faint)] transition-transform flex-shrink-0"
                                    style={{ transform: isProjExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                  >
                                    expand_more
                                  </span>
                                </button>

                                {/* Phases (visible if project expanded) */}
                                {isProjExpanded && (
                                  <div className="border-t border-[var(--line)] bg-neutral-800/[0.02] p-3 flex flex-col gap-3">
                                    {proj.phases.length === 0 ? (
                                      <div className="p-3 text-center text-xs text-[var(--ink-soft)]">
                                        {t('emptyPhase')}
                                      </div>
                                    ) : (
                                      proj.phases.map((phase) => (
                                        <div
                                          key={phase.id}
                                          className="rounded-xl border border-[var(--line)] bg-[var(--card)] overflow-hidden"
                                        >
                                          <div
                                            className="px-4 py-2.5 flex items-center justify-between gap-2 bg-neutral-800/5"
                                          >
                                            <span className="font-bold text-[12.5px] text-[var(--ink)]">
                                              {phase.title}
                                            </span>
                                            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-neutral-800/10 text-[var(--ink-soft)]">
                                              {t('tasksCount', { count: phase.tasks.length })}
                                            </span>
                                          </div>
                                          <ul className="divide-y divide-[var(--line)]">
                                            {phase.tasks.map((task) => (
                                              <li
                                                key={task.id}
                                                className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-neutral-800/[0.03] transition-all"
                                              >
                                                <span className="text-[12.5px] text-[var(--ink)] truncate">
                                                  {task.title}
                                                </span>
                                                <span className="text-[10.5px] text-[var(--ink-faint)] flex-shrink-0 font-medium">
                                                  {task.duration}
                                                </span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </HubLayout>
  );
}
