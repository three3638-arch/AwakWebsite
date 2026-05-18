import { useState, useEffect, useCallback } from 'react';
import { CycleSelector } from '../../components/CycleSelector';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { useCycleStore } from '../../stores/cycleStore';
import { useObjectiveStore } from '../../stores/objectiveStore';
import { api } from '../../services/api';
import type { ObjectiveReport } from '../../types';

// ─── 风险等级样式映射 ──────────────────────────
const riskStyle: Record<string, { bg: string; text: string; label: string }> = {
  overdue: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: '逾期' },
  behind_schedule: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: '进度落后' },
  no_progress: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: '无进展' },
};

/** 格式化日期 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/** 生成 Markdown 文本 */
function generateMarkdown(report: ObjectiveReport): string {
  const lines: string[] = [];
  lines.push(`# OKR 简报：${report.objective.title}`);
  lines.push(`生成时间：${formatDate(report.generatedAt)}`);
  lines.push('');
  lines.push('## 总体进度');
  lines.push(`- 完成率：${Math.round(report.summary.overallProgress)}%`);
  lines.push(`- 关键结果：${report.summary.completedKRs}/${report.summary.totalKRs}`);
  if (report.summary.averageScore !== null) {
    lines.push(`- 平均评分：${report.summary.averageScore}`);
  }
  lines.push('');

  if (report.keyResults.length > 0) {
    lines.push('## 关键结果详情');
    for (const kr of report.keyResults) {
      const progress = kr.targetValue > 0 ? Math.round((kr.currentValue / kr.targetValue) * 100) : 0;
      lines.push(`### ${kr.title} (权重:${kr.weight}%)`);
      lines.push(`- 进度：${progress}%`);
      if (kr.score !== null) lines.push(`- 评分：${kr.score}`);
      lines.push(`- Todo：${kr.completedTodos}/${kr.totalTodos}`);
      lines.push('');
    }
  }

  if (report.risks.length > 0) {
    lines.push('## 风险项');
    for (const risk of report.risks) {
      const icon = risk.type === 'overdue' ? '🔴' : risk.type === 'behind_schedule' ? '🟡' : '🟠';
      lines.push(`- ${icon} ${risk.description}`);
    }
    lines.push('');
  }

  if (report.timeline.length > 0) {
    lines.push('## 里程碑');
    for (const ev of report.timeline) {
      lines.push(`- ${formatDate(ev.date)}: ${ev.event}`);
    }
  }

  return lines.join('\n');
}

export function ReportPage() {
  const { currentCycle } = useCycleStore();
  const { objectives, fetchObjectives } = useObjectiveStore();

  const [selectedObjId, setSelectedObjId] = useState('');
  const [report, setReport] = useState<ObjectiveReport | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // 当周期变化时刷新目标列表
  useEffect(() => {
    if (currentCycle) {
      fetchObjectives(currentCycle.id);
      setSelectedObjId('');
      setReport(null);
    }
  }, [currentCycle, fetchObjectives]);

  // 当前周期的目标列表
  const cycleObjectives = currentCycle
    ? objectives.filter((o) => o.cycleId === currentCycle.id)
    : [];

  // 生成简报
  const handleGenerate = useCallback(async () => {
    if (!selectedObjId) return;
    setGenerating(true);
    setError('');
    try {
      const data = await api.get<ObjectiveReport>(`/api/reports/objective/${selectedObjId}`);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成简报失败');
    } finally {
      setGenerating(false);
    }
  }, [selectedObjId]);

  // 复制 Markdown
  const handleCopyMarkdown = useCallback(() => {
    if (!report) return;
    const md = generateMarkdown(report);
    navigator.clipboard.writeText(md).then(() => {
      alert('Markdown 已复制到剪贴板');
    }).catch(() => {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = md;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Markdown 已复制到剪贴板');
    });
  }, [report]);

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">OKR 简报</h1>
        <p className="mt-1 text-sm text-gray-500">选择目标并生成完成情况简报</p>
      </div>

      {/* 选择器行 */}
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">周期</label>
            <CycleSelector />
          </div>
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">目标</label>
            <select
              value={selectedObjId}
              onChange={(e) => {
                setSelectedObjId(e.target.value);
                setReport(null);
              }}
              className="block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">选择目标...</option>
              {cycleObjectives.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleGenerate} loading={generating} disabled={!selectedObjId}>
            生成简报
          </Button>
        </div>
      </Card>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* 加载中 */}
      {generating && <Loading text="正在生成简报..." />}

      {/* 简报内容 */}
      {report && !generating && (
        <div className="space-y-6">
          {/* 导出按钮 */}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleCopyMarkdown}>
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              复制为 Markdown
            </Button>
          </div>

          {/* 总体概况卡片 */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">{report.objective.title}</h2>
            {report.objective.description && (
              <p className="mt-1 text-sm text-gray-500">{report.objective.description}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* 完成率圆环 */}
              <div className="flex flex-col items-center">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke={report.summary.overallProgress >= 70 ? '#22c55e' : report.summary.overallProgress >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="3"
                      strokeDasharray={`${report.summary.overallProgress} ${100 - report.summary.overallProgress}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{report.summary.overallProgress}%</span>
                  </div>
                </div>
                <span className="mt-1 text-xs text-gray-500">完成率</span>
              </div>

              {/* 统计数字 */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{report.summary.completedKRs}/{report.summary.totalKRs}</span>
                <span className="mt-1 text-xs text-gray-500">关键结果</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {report.summary.averageScore !== null ? report.summary.averageScore : '-'}
                </span>
                <span className="mt-1 text-xs text-gray-500">平均评分</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{report.risks.length}</span>
                <span className="mt-1 text-xs text-gray-500">风险项</span>
              </div>
            </div>
          </Card>

          {/* KR 进度列表 */}
          {report.keyResults.length > 0 && (
            <Card>
              <h3 className="mb-4 text-base font-semibold text-gray-900">关键结果详情</h3>
              <div className="space-y-3">
                {report.keyResults.map((kr) => {
                  const progress = kr.targetValue > 0
                    ? Math.round((kr.currentValue / kr.targetValue) * 100)
                    : 0;
                  return (
                    <div key={kr.id} className="rounded-lg border border-gray-100 p-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-gray-900">{kr.title}</span>
                          <span className="ml-2 text-xs text-gray-400">权重 {kr.weight}%</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {kr.score !== null && (
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700">
                              评分 {kr.score}
                            </span>
                          )}
                          <span>Todo {kr.completedTodos}/{kr.totalTodos}</span>
                          {kr.overdueTodos > 0 && (
                            <span className="text-red-600">逾期 {kr.overdueTodos}</span>
                          )}
                        </div>
                      </div>
                      {/* 进度条 */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, progress)}%`,
                              backgroundColor: progress >= 70 ? '#22c55e' : progress >= 40 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* 风险项列表 */}
          {report.risks.length > 0 && (
            <Card>
              <h3 className="mb-4 text-base font-semibold text-gray-900">风险项</h3>
              <div className="space-y-2">
                {report.risks.map((risk, i) => {
                  const style = riskStyle[risk.type] || riskStyle.behind_schedule;
                  return (
                    <div key={i} className={`rounded-lg border p-3 ${style.bg}`}>
                      <div className="flex items-start gap-2">
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${style.text} bg-white/60`}>
                          {style.label}
                        </span>
                        <span className={`text-sm ${style.text}`}>{risk.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* 时间线 */}
          {report.timeline.length > 0 && (
            <Card>
              <h3 className="mb-4 text-base font-semibold text-gray-900">时间线</h3>
              <div className="relative pl-6">
                {/* 竖线 */}
                <div className="absolute left-2 top-1 bottom-1 w-px bg-gray-200" />
                <div className="space-y-4">
                  {report.timeline.map((ev, i) => (
                    <div key={i} className="relative">
                      {/* 圆点 */}
                      <div className="absolute -left-4 top-1.5 h-2 w-2 rounded-full bg-blue-400" />
                      <div className="flex items-baseline gap-3">
                        <span className="shrink-0 text-xs text-gray-400">{formatDate(ev.date)}</span>
                        <span className="text-sm text-gray-700">{ev.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* 生成时间 */}
          <p className="text-center text-xs text-gray-400">
            简报生成于 {formatDate(report.generatedAt)}
          </p>
        </div>
      )}

      {/* 空状态 */}
      {!report && !generating && !error && (
        <div className="py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-400">选择周期和目标后点击「生成简报」</p>
        </div>
      )}
    </div>
  );
}
