import { useState } from 'react';
import { ObjectiveTreeNode } from '../../types';
import { useUserStore } from '../../stores/userStore';

interface AlignmentViewProps {
  tree: ObjectiveTreeNode[];
}

/** 完成度进度条 */
function CompletionBar({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  let colorClass = 'bg-gray-300';
  if (percent >= 70) colorClass = 'bg-green-500';
  else if (percent >= 40) colorClass = 'bg-blue-500';
  else if (percent > 0) colorClass = 'bg-amber-500';

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-gray-500">{percent}%</span>
    </div>
  );
}

/** 用户显示名 */
function UserBadge({ userId }: { userId: string }) {
  const { users } = useUserStore();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return <span className="text-xs text-gray-400">{userId.slice(0, 6)}</span>;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
        {user.displayName.charAt(0)}
      </span>
      {user.displayName}
    </span>
  );
}

/** 树节点 */
function TreeNode({ node, depth = 0 }: { node: ObjectiveTreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const obj = node.objective;

  return (
    <div>
      <div
        className="group flex items-center gap-2 rounded-lg py-2 pr-3 hover:bg-gray-50"
        style={{ paddingLeft: `${depth * 24 + 4}px` }}
      >
        {/* 展开/折叠按钮 */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 ${
            !hasChildren ? 'invisible' : ''
          }`}
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 连接线 */}
        {depth > 0 && (
          <div className="flex h-5 w-4 shrink-0 items-center justify-center">
            <svg className="h-5 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 16 20">
              <path strokeLinecap="round" strokeWidth={1.5} d="M0 0v12a4 4 0 004 4h12" />
            </svg>
          </div>
        )}

        {/* 目标信息 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-gray-900">{obj.title}</span>
            <UserBadge userId={obj.createdBy} />
          </div>
        </div>

        {/* 完成度 */}
        <CompletionBar value={obj.completion} />
      </div>

      {/* 子节点 */}
      {hasChildren && expanded && (
        <div className="relative">
          {/* 竖向连接线 */}
          <div
            className="absolute top-0 bottom-0 w-px bg-gray-200"
            style={{ left: `${depth * 24 + 14}px` }}
          />
          {node.children.map((child) => (
            <TreeNode key={child.objective.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AlignmentView({ tree }: AlignmentViewProps) {
  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg className="mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
        <p className="text-sm">暂无对齐关系</p>
        <p className="mt-1 text-xs">创建目标并设置父级目标后，对齐关系将在此展示</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {tree.map((node) => (
        <TreeNode key={node.objective.id} node={node} depth={0} />
      ))}
    </div>
  );
}
