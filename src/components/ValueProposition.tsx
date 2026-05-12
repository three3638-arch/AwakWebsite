import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type DialNodeData = { a: number; t1: string; t2: string; n: string; u: string };

/**
 * PC 首页「AWAK 健康闭环」—— 金属表盘 8 节点（设计稿迁入 React，白/灰/黑无绿色）
 */
export default function ValueProposition() {
  const { t, i18n } = useTranslation('common');
  const rootRef = useRef<HTMLElement>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gBezelRef = useRef<SVGGElement>(null);
  const gTicksRef = useRef<SVGGElement>(null);
  const gNDotsRef = useRef<SVGGElement>(null);
  const gConnsRef = useRef<SVGGElement>(null);
  const handGRef = useRef<SVGGElement>(null);
  const cLayerRef = useRef<HTMLDivElement>(null);
  const dotsRowRef = useRef<HTMLDivElement>(null);
  const hubNRef = useRef<HTMLDivElement>(null);
  const hubURef = useRef<HTMLDivElement>(null);

  const uid = 'vpd';

  useEffect(() => {
    const dialRaw = t('home.valueLoop.dialNodes', { returnObjects: true });
    const dialArr = Array.isArray(dialRaw) ? dialRaw : [];
    const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;
    const NODES: DialNodeData[] = ANGLES.map((a, i) => {
      const row = dialArr[i] as { t1?: string; t2?: string; n?: string; u?: string } | undefined;
      return {
        a,
        t1: row?.t1 ?? '',
        t2: row?.t2 ?? '',
        n: row?.n ?? '—',
        u: row?.u ?? '',
      };
    });

    const root = rootRef.current;
    const stageWrap = stageWrapRef.current;
    const stage = stageRef.current;
    const gBezel = gBezelRef.current;
    const gTicks = gTicksRef.current;
    const gNDots = gNDotsRef.current;
    const gConns = gConnsRef.current;
    const handG = handGRef.current;
    const cLayer = cLayerRef.current;
    const dotsRow = dotsRowRef.current;
    const hubN = hubNRef.current;
    const hubU = hubURef.current;

    if (
      !root ||
      !stageWrap ||
      !stage ||
      !gBezel ||
      !gTicks ||
      !gNDots ||
      !gConns ||
      !handG ||
      !cLayer ||
      !dotsRow ||
      !hubN ||
      !hubU
    ) {
      return;
    }

    const NS = 'http://www.w3.org/2000/svg';
    const CX = 520;
    const CY = 420;

    const BEZEL_MID_R = 228;
    const BEZEL_SW = 26;
    const BEZEL_OUTER = 241;
    const BEZEL_INNER = 215;
    const TICK_OUTER_R = 207;
    const RING_R = 188;
    /** 连线起点略宽于表圈外沿；锚点半径增大使卡片外移，避免与大字号卡片叠在表盘上 */
    const CONN_R_START = 220;
    const ANCHOR_R = 302;
    const CARD_W = 162;

    const LIGHT_DEG = 315;

    const OFFSETS = [
      { dx: -CARD_W / 2, dy: -74 },
      { dx: 22, dy: -66 },
      { dx: 22, dy: -30 },
      { dx: 22, dy: 16 },
      { dx: -CARD_W / 2, dy: 16 },
      { dx: -CARD_W - 22, dy: 16 },
      { dx: -CARD_W - 22, dy: -30 },
      { dx: -CARD_W - 22, dy: -66 },
    ];
    const ALIGNS = ['center', 'left', 'left', 'left', 'center', 'right', 'right', 'right'] as const;

    let activeIdx = 0;
    let handAngle = 0;
    let hFrom = 0;
    let hTo = 0;
    let hDelta = 0;
    let hStart: number | null = null;
    let hRaf: number | null = null;
    let autoT: ReturnType<typeof setInterval> | null = null;
    let paused = false;
    const HAND_DUR = 950;

    const staggerTimeouts: ReturnType<typeof setTimeout>[] = [];

    function toRad(deg: number) {
      return ((deg - 90) * Math.PI) / 180;
    }
    function ptX(r: number, deg: number) {
      return (CX + r * Math.cos(toRad(deg))).toFixed(2);
    }
    function ptY(r: number, deg: number) {
      return (CY + r * Math.sin(toRad(deg))).toFixed(2);
    }

    function lightT(deg: number) {
      const diff = Math.abs(((deg - LIGHT_DEG + 540) % 360) - 180);
      return 1 - diff / 180;
    }

    function arcPath(r: number, startDeg: number, endDeg: number) {
      const sr = toRad(startDeg + 90);
      const er = toRad(endDeg + 90);
      const x1 = (CX + r * Math.cos(sr)).toFixed(2);
      const y1 = (CY + r * Math.sin(sr)).toFixed(2);
      const x2 = (CX + r * Math.cos(er)).toFixed(2);
      const y2 = (CY + r * Math.sin(er)).toFixed(2);
      const large = endDeg - startDeg > 180 ? 1 : 0;
      return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    }

    function svgEl(tag: string, attrs: Record<string, string>) {
      const el = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    }

    function buildBezel() {
      const g = gBezel;

      g.appendChild(
        svgEl('circle', {
          cx: String(CX),
          cy: String(CY),
          r: String(BEZEL_OUTER + 5),
          fill: 'none',
          stroke: 'rgba(0,0,0,.7)',
          'stroke-width': '5',
        }),
      );

      const N = 72;
      const STEP = 360 / N;
      for (let i = 0; i < N; i++) {
        const start = i * STEP;
        const end = (i + 1) * STEP;
        const mid = start + STEP / 2;
        const lt = lightT(mid);
        const L = 6 + lt * 34;
        const S = lt * 2;
        const color = `hsl(0,${S.toFixed(0)}%,${L.toFixed(0)}%)`;
        g.appendChild(
          svgEl('path', {
            d: arcPath(BEZEL_MID_R, start, end + 0.3),
            fill: 'none',
            stroke: color,
            'stroke-width': String(BEZEL_SW),
            'stroke-linecap': 'butt',
          }),
        );
      }

      for (let i = 0; i < 36; i++) {
        const start = i * 10;
        const end = (i + 1) * 10;
        const mid = start + 5;
        const lt = lightT(mid);
        const op = 0.08 + lt * 0.55;
        const sw = 0.8 + lt * 1.0;
        g.appendChild(
          svgEl('path', {
            d: arcPath(BEZEL_OUTER, start, end + 0.5),
            fill: 'none',
            stroke: `rgba(255,255,255,${op.toFixed(3)})`,
            'stroke-width': sw.toFixed(2),
            'stroke-linecap': 'butt',
          }),
        );
      }

      for (let i = 0; i < 36; i++) {
        const start = i * 10;
        const end = (i + 1) * 10;
        const mid = start + 5;
        const lt = lightT(mid);
        const op = 0.04 + lt * 0.22;
        g.appendChild(
          svgEl('path', {
            d: arcPath(BEZEL_INNER + 1.5, start, end + 0.5),
            fill: 'none',
            stroke: `rgba(255,255,255,${op.toFixed(3)})`,
            'stroke-width': '1.5',
            'stroke-linecap': 'butt',
          }),
        );
      }

      g.appendChild(
        svgEl('circle', {
          cx: String(CX),
          cy: String(CY),
          r: String(BEZEL_INNER - 1),
          fill: 'none',
          stroke: 'rgba(0,0,0,.55)',
          'stroke-width': '2.5',
        }),
      );

      g.appendChild(
        svgEl('circle', {
          cx: String(CX),
          cy: String(CY),
          r: String(BEZEL_OUTER + 2),
          fill: 'none',
          stroke: 'rgba(255,255,255,.06)',
          'stroke-width': '1',
        }),
      );
    }

    function buildTicks() {
      const g = gTicks;
      for (let deg = 0; deg < 360; deg += 5) {
        const isNode = deg % 45 === 0;
        const isMed = deg % 15 === 0 && !isNode;
        const lt = lightT(deg);
        const tickLen = isNode ? 13 : isMed ? 8 : 5;
        const sw = isNode ? 0.9 + lt * 0.8 : 0.5 + lt * 0.4;
        const baseOp = isNode ? 0.45 : isMed ? 0.22 : 0.12;
        const op = baseOp + lt * (isNode ? 0.45 : isMed ? 0.35 : 0.28);
        const outerR = TICK_OUTER_R;
        const innerR = TICK_OUTER_R - tickLen;
        const x1 = ptX(innerR, deg);
        const y1 = ptY(innerR, deg);
        const x2 = ptX(outerR, deg);
        const y2 = ptY(outerR, deg);
        const ln = svgEl('line', {
          x1,
          y1,
          x2,
          y2,
          stroke: '#D1D1D6',
          'stroke-width': sw.toFixed(2),
          opacity: Math.min(op, 0.92).toFixed(3),
        });
        g.appendChild(ln);

        if (isNode && lt > 0.5) {
          const sparkOp = (lt - 0.5) * 2 * 0.7;
          g.appendChild(
            svgEl('line', {
              x1: ptX(innerR + 2, deg),
              y1: ptY(innerR + 2, deg),
              x2: ptX(outerR, deg),
              y2: ptY(outerR, deg),
              stroke: '#fff',
              'stroke-width': (sw * 0.4).toFixed(2),
              opacity: sparkOp.toFixed(3),
            }),
          );
        }
      }
    }

    function buildNodeDots() {
      const g = gNDots;
      NODES.forEach((n, i) => {
        const x = ptX(RING_R, n.a);
        const y = ptY(RING_R, n.a);
        const gw = svgEl('circle', {
          cx: x,
          cy: y,
          r: '8',
          fill: 'rgba(255,255,255,0)',
          id: `${uid}-ndgw-${i}`,
        });
        (gw as unknown as HTMLElement).style.transition = 'fill .4s';
        g.appendChild(gw);

        const dt = svgEl('circle', {
          cx: x,
          cy: y,
          r: '2.8',
          fill: 'rgba(255,255,255,.2)',
          id: `${uid}-nddot-${i}`,
        });
        (dt as unknown as HTMLElement).style.transition = 'fill .4s, r .3s';
        g.appendChild(dt);
      });
    }

    function buildConnectors() {
      const g = gConns;
      NODES.forEach((n, i) => {
        const rad = toRad(n.a);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const x1 = (CX + CONN_R_START * cos).toFixed(2);
        const y1 = (CY + CONN_R_START * sin).toFixed(2);
        const x2 = (CX + (ANCHOR_R - 14) * cos).toFixed(2);
        const y2 = (CY + (ANCHOR_R - 14) * sin).toFixed(2);
        const ln = svgEl('line', {
          x1,
          y1,
          x2,
          y2,
          stroke: 'rgba(255,255,255,.05)',
          'stroke-width': '1',
          'stroke-dasharray': '3 5',
          id: `${uid}-conn-${i}`,
        });
        (ln as unknown as HTMLElement).style.transition = 'stroke .4s,stroke-width .4s';
        g.appendChild(ln);
      });
    }

    const cardClickHandlers: Array<() => void> = [];
    const cardEnterHandlers: Array<() => void> = [];
    const cardLeaveHandlers: Array<() => void> = [];
    const pdClickHandlers: Array<() => void> = [];

    function easeOutExpo(t: number) {
      return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function sweepHand(target: number) {
      if (hRaf != null) cancelAnimationFrame(hRaf);
      hFrom = handAngle;
      let d = target - hFrom;
      if (d < 0) d += 360;
      if (d === 0) d = 360;
      hDelta = d;
      hTo = target;
      hStart = null;
      hRaf = requestAnimationFrame(stepHand);
    }

    function stepHand(ts: number) {
      if (hStart == null) hStart = ts;
      const p = Math.min((ts - hStart) / HAND_DUR, 1);
      const cur = hFrom + hDelta * easeOutExpo(p);
      handAngle = cur % 360;
      handG.setAttribute('transform', `translate(${CX},${CY}) rotate(${cur})`);
      if (p < 1) hRaf = requestAnimationFrame(stepHand);
      else {
        handAngle = hTo;
        hRaf = null;
      }
    }

    function activateNode(idx: number) {
      activeIdx = idx;
      const n = NODES[idx];

      NODES.forEach((_, i) => {
        const c = document.getElementById(`${uid}-nc-${i}`);
        if (c) {
          c.classList.toggle('vpd-nc-on', i === idx);
          c.style.zIndex = i === idx ? '30' : '10';
        }
      });
      NODES.forEach((_, i) =>
        document.getElementById(`${uid}-pd-${i}`)?.classList.toggle('vpd-pd-on', i === idx),
      );

      NODES.forEach((_, i) => {
        document.getElementById(`${uid}-nddot-${i}`)?.setAttribute(
          'fill',
          i === idx ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.2)',
        );
        document.getElementById(`${uid}-nddot-${i}`)?.setAttribute('r', i === idx ? '4.2' : '2.8');
        document.getElementById(`${uid}-ndgw-${i}`)?.setAttribute(
          'fill',
          i === idx ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,0)',
        );
        document.getElementById(`${uid}-conn-${i}`)?.setAttribute(
          'stroke',
          i === idx ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.05)',
        );
        document.getElementById(`${uid}-conn-${i}`)?.setAttribute(
          'stroke-width',
          i === idx ? '1.4' : '1',
        );
      });

      hubN.textContent = n.n;
      hubU.textContent = n.u;
      sweepHand(n.a);
    }

    function resetAuto() {
      if (autoT) clearInterval(autoT);
      autoT = setInterval(() => {
        if (!paused) activateNode((activeIdx + 1) % 8);
      }, 4000);
    }

    function buildCards() {
      const layer = cLayer;
      const dotsRowEl = dotsRow;
      NODES.forEach((n, i) => {
        const rad = toRad(n.a);
        const ax = CX + ANCHOR_R * Math.cos(rad);
        const ay = CY + ANCHOR_R * Math.sin(rad);
        const off = OFFSETS[i];
        const al = ALIGNS[i];

        const card = document.createElement('div');
        card.className = 'vpd-nc';
        card.id = `${uid}-nc-${i}`;
        card.style.left = `${Math.round(ax + off.dx)}px`;
        card.style.top = `${Math.round(ay + off.dy)}px`;
        card.style.textAlign = al;
        card.style.alignItems = al === 'center' ? 'center' : al === 'right' ? 'flex-end' : 'flex-start';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85)';

        card.innerHTML = `
      <div class="vpd-nc-dot"></div>
      <div class="vpd-nc-t">${n.t1}<br/>${n.t2}</div>
      <span class="vpd-nc-u"></span>`;

        const onClick = () => {
          activateNode(i);
          paused = false;
          resetAuto();
        };
        const onEnter = () => {
          paused = true;
          activateNode(i);
        };
        const onLeave = () => {
          setTimeout(() => {
            paused = false;
          }, 2200);
        };
        card.addEventListener('click', onClick);
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
        cardClickHandlers.push(onClick);
        cardEnterHandlers.push(onEnter);
        cardLeaveHandlers.push(onLeave);
        layer.appendChild(card);

        const pd = document.createElement('div');
        pd.className = 'vpd-pd';
        pd.id = `${uid}-pd-${i}`;
        const onPdClick = () => {
          activateNode(i);
          resetAuto();
        };
        pd.addEventListener('click', onPdClick);
        pdClickHandlers.push(onPdClick);
        dotsRowEl.appendChild(pd);
      });
    }

    const STAGE_W = 1040;
    const STAGE_H = 840;
    /** 允许略大于 1，配合左侧栏宽度「放大表盘」；下限避免极小屏叠爆 */
    const SCALE_MIN = 0.38;
    const SCALE_MAX = 1.26;

    function rescale() {
      const wrapW = stageWrap.clientWidth || window.innerWidth;
      const base = wrapW / STAGE_W;
      const s = Math.min(Math.max(base, SCALE_MIN), SCALE_MAX);
      stage.style.transform = `scale(${s})`;
      stage.style.marginLeft = '';
      stage.style.marginRight = '';
      stageWrap.style.height = `${STAGE_H * s}px`;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        activateNode((activeIdx + 1) % 8);
        resetAuto();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        activateNode((activeIdx + 7) % 8);
        resetAuto();
      }
    }

    buildBezel();
    buildTicks();
    buildNodeDots();
    buildConnectors();
    buildCards();

    handG.setAttribute('transform', `translate(${CX},${CY}) rotate(0)`);

    document.querySelectorAll(`#${uid}-root .vpd-nc`).forEach((c, i) => {
      const el = c as HTMLElement;
      const tid = setTimeout(() => {
        el.style.transition = `opacity .65s cubic-bezier(.16,1,.3,1) ${i * 0.045}s,
                            transform .65s cubic-bezier(.16,1,.3,1) ${i * 0.045}s`;
        el.style.opacity = '0.28';
        el.style.transform = '';
      }, 250 + i * 55);
      staggerTimeouts.push(tid);
    });

    const activateTid = setTimeout(() => {
      activateNode(0);
      resetAuto();
    }, 900);
    staggerTimeouts.push(activateTid);

    root.style.opacity = '0';
    root.style.transition = 'opacity .7s ease';
    const obs = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) root.style.opacity = '1';
      },
      { threshold: 0.12 },
    );
    obs.observe(root);

    rescale();
    const ro = new ResizeObserver(() => rescale());
    ro.observe(stageWrap);
    window.addEventListener('resize', rescale);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      obs.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', rescale);
      document.removeEventListener('keydown', onKeyDown);
      if (autoT) clearInterval(autoT);
      if (hRaf != null) cancelAnimationFrame(hRaf);
      staggerTimeouts.forEach(clearTimeout);

      document.querySelectorAll(`#${uid}-root .vpd-nc`).forEach((card, i) => {
        card.removeEventListener('click', cardClickHandlers[i]);
        card.removeEventListener('mouseenter', cardEnterHandlers[i]);
        card.removeEventListener('mouseleave', cardLeaveHandlers[i]);
        card.remove();
      });
      dotsRow.querySelectorAll('.vpd-pd').forEach((pd, i) => {
        pd.removeEventListener('click', pdClickHandlers[i]);
        pd.remove();
      });

      gBezel.innerHTML = '';
      gTicks.innerHTML = '';
      gNDots.innerHTML = '';
      gConns.innerHTML = '';

      root.style.opacity = '';
      root.style.transition = '';
      stage.style.transform = '';
      stage.style.marginLeft = '';
      stage.style.marginRight = '';
      stageWrap.style.height = '';
    };
  }, [t, i18n.language]);

  return (
    <>
      <style>{`
#${uid}-root *,#${uid}-root *::before,#${uid}-root *::after{box-sizing:border-box;margin:0;padding:0}
#${uid}-root{
  font-family:'DM Sans','Noto Sans SC',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  background:#060606;color:#fff;
  overflow-x:hidden;
}
#${uid}-root .vpd-sec{
  width:100%;
  min-height:100vh;
  min-height:100dvh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  padding-top:max(2.5rem, env(safe-area-inset-top));
  padding-bottom:max(2.5rem, env(safe-area-inset-bottom));
  box-sizing:border-box;
  background:radial-gradient(ellipse 60% 55% at 50% 52%,
    rgba(25,25,25,.75) 0%, #060606 68%);
  position:relative;
}
/* 页边距由外层 Tailwind px-6 md:px-[170px] 与 IntroSection「服务生态」一致 */
#${uid}-root .vpd-inner{
  box-sizing:border-box;
}
#${uid}-root .vpd-copy{position:relative;z-index:10;min-width:0;}
#${uid}-root .vpd-wrap{
  display:flex;justify-content:center;align-items:center;
  overflow:visible;min-width:0;
}
@media (min-width:1024px){
  #${uid}-root .vpd-wrap{justify-content:flex-start;}
}
#${uid}-root .vpd-stage{
  position:relative;width:1040px;height:840px;margin-left:auto;margin-right:auto;
  flex-shrink:0;transform-origin:top center;
}
#${uid}-root .vpd-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
#${uid}-root .vpd-cl{position:absolute;inset:0;pointer-events:none;}
#${uid}-root .vpd-nc{
  position:absolute;width:162px;
  pointer-events:all;cursor:pointer;
  opacity:.28;
  transform:scale(.95);
  transition:opacity .5s cubic-bezier(.16,1,.3,1),
             transform .5s cubic-bezier(.16,1,.3,1);
  display:flex;flex-direction:column;
}
#${uid}-root .vpd-nc:hover{opacity:.75!important;transform:scale(1.04)!important;}
#${uid}-root .vpd-nc-on{opacity:1!important;transform:scale(1)!important;z-index:30;}
#${uid}-root .vpd-nc-dot{
  width:5px;height:5px;border-radius:50%;
  background:rgba(255,255,255,.28);
  margin-bottom:8px;
  transition:background .45s,transform .45s;
  flex-shrink:0;
}
#${uid}-root .vpd-nc-on .vpd-nc-dot{background:#fff;transform:scale(1.5);}
#${uid}-root .vpd-nc-t{
  font-size:clamp(15px,1.12vw,19px);font-weight:700;
  letter-spacing:-.02em;line-height:1.38;
  color:rgba(255,255,255,.38);
  transition:color .45s;
  white-space:nowrap;
}
#${uid}-root .vpd-nc-on .vpd-nc-t{color:#fff;}
#${uid}-root .vpd-nc-u{
  display:block;margin-top:9px;height:1px;border-radius:1px;
  background:#fff;width:0;opacity:0;
  transition:width .55s cubic-bezier(.16,1,.3,1),opacity .3s;
}
#${uid}-root .vpd-nc-on .vpd-nc-u{width:28px;opacity:.6;}
#${uid}-root .vpd-hub{
  position:absolute;left:50%;top:50%;
  width:102px;height:102px;
  transform:translate(-50%,-52%);
  border-radius:50%;
  background:rgba(255,255,255,.05);
  backdrop-filter:blur(20px) saturate(150%);
  -webkit-backdrop-filter:blur(20px) saturate(150%);
  border:1px solid rgba(255,255,255,.10);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:2px;
  z-index:25;pointer-events:none;
}
#${uid}-root .vpd-hub-brand{font-size:9px;font-weight:800;letter-spacing:.2em;
  color:rgba(255,255,255,.35);text-transform:uppercase;}
#${uid}-root .vpd-hub-n{font-size:22px;font-weight:900;letter-spacing:-.05em;
  color:#fff;line-height:1;transition:opacity .3s;}
#${uid}-root .vpd-hub-u{font-size:8px;font-weight:600;letter-spacing:.1em;
  color:rgba(255,255,255,.28);text-transform:uppercase;}
#${uid}-root .vpd-hub-ring{
  position:absolute;inset:-10px;border-radius:50%;
  border:1px solid rgba(255,255,255,0);
  animation:vpd-hubP 4s ease-in-out infinite;
}
@keyframes vpd-hubP{
  0%,100%{border-color:rgba(255,255,255,.0);transform:scale(1)}
  50%{border-color:rgba(255,255,255,.10);transform:scale(1.08)}
}
#${uid}-root .vpd-dots{
  display:flex;gap:8px;justify-content:center;align-items:center;
  margin-top:clamp(1.25rem,3vh,2.25rem);width:100%;flex-wrap:wrap;
}
#${uid}-root .vpd-pd{width:5px;height:5px;border-radius:3px;
  background:rgba(255,255,255,.12);cursor:pointer;
  transition:width .35s cubic-bezier(.16,1,.3,1),background .3s;}
#${uid}-root .vpd-pd-on{width:20px;background:rgba(255,255,255,.75);}
`}</style>

      <section ref={rootRef} id={`${uid}-root`} className="relative isolate w-full">
        <div className="vpd-sec" id={`${uid}-sec`}>
          <div className="vpd-inner mx-auto flex w-full max-w-[100vw] flex-col justify-center px-6 md:px-[170px]">
            <div className="flex w-full flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-14">
              <div
                ref={stageWrapRef}
                className="vpd-wrap w-full min-w-0 lg:w-[56%] lg:max-w-[58%] xl:w-[54%] xl:max-w-none"
              >
                <div ref={stageRef} className="vpd-stage">
              <svg
                className="vpd-svg"
                viewBox="0 0 1040 840"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <radialGradient id={`${uid}-gFace`} cx="44%" cy="38%" r="60%">
                    <stop offset="0%" stopColor="#181818" />
                    <stop offset="65%" stopColor="#111111" />
                    <stop offset="100%" stopColor="#0c0c0c" />
                  </radialGradient>
                  <radialGradient id={`${uid}-gAmb`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(40,40,40,.5)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                  <radialGradient id={`${uid}-gCrystal`} cx="38%" cy="22%" r="55%">
                    <stop offset="0%" stopColor="rgba(255,255,255,.05)" />
                    <stop offset="60%" stopColor="rgba(255,255,255,.012)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  <filter id={`${uid}-fTip`} x="-500%" y="-500%" width="1100%" height="1100%">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id={`${uid}-fShadow`} x="-8%" y="-8%" width="116%" height="116%">
                    <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#000" floodOpacity=".8" />
                  </filter>
                  <clipPath id={`${uid}-cpFace`}>
                    <circle cx="520" cy="420" r="215" />
                  </clipPath>
                </defs>

                <circle cx="520" cy="420" r="280" fill={`url(#${uid}-gAmb)`} opacity=".7" />

                <g ref={gBezelRef} filter={`url(#${uid}-fShadow)`} />

                <circle cx="520" cy="420" r="215" fill={`url(#${uid}-gFace)`} />

                <circle
                  cx="520"
                  cy="420"
                  r="208"
                  fill="none"
                  stroke="rgba(255,255,255,.06)"
                  strokeWidth=".6"
                />

                <g ref={gTicksRef} />

                <ellipse
                  cx="490"
                  cy="360"
                  rx="148"
                  ry="110"
                  fill={`url(#${uid}-gCrystal)`}
                  clipPath={`url(#${uid}-cpFace)`}
                />

                <g ref={gNDotsRef} />

                <g ref={gConnsRef} />

                <g ref={handGRef} transform="translate(520,420) rotate(0)">
                  <line
                    x1="0"
                    y1="6"
                    x2="0"
                    y2="-186"
                    stroke="rgba(255,255,255,.04)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <line
                    x1="0"
                    y1="7"
                    x2="0"
                    y2="-187"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect x="-1.5" y="8" width="3" height="16" rx="1.5" fill="rgba(255,255,255,.25)" />
                  <circle cx="0" cy="-187" r="9" fill="rgba(255,255,255,.10)" filter={`url(#${uid}-fTip)`} />
                  <circle cx="0" cy="-187" r="3" fill="#fff" />
                </g>

                <circle cx="520" cy="420" r="48" fill="rgba(255,255,255,.04)" filter={`url(#${uid}-fTip)`} />
              </svg>

              <div ref={cLayerRef} className="vpd-cl" />

              <div className="vpd-hub">
                <div className="vpd-hub-ring" />
                <div className="vpd-hub-brand">AWAK</div>
                <div ref={hubNRef} className="vpd-hub-n">
                  01
                </div>
                <div ref={hubURef} className="vpd-hub-u">
                  HEALTH
                </div>
              </div>
                </div>
              </div>

              <div className="vpd-copy flex w-full flex-col justify-center text-left lg:min-w-0 lg:flex-1 lg:pl-6 xl:pl-12">
                <h2 className="mb-6 text-7xl font-black leading-[1.05] tracking-[-3px] text-white md:text-[90px] lg:text-[100px]">
                  {t('home.valueLoop.title')}
                </h2>
                <p className="max-w-xl text-[17.5px] font-light leading-relaxed text-white/35 md:text-[22px]">
                  {t('home.valueLoop.subtitle')}
                </p>
              </div>
            </div>

            <div ref={dotsRowRef} className="vpd-dots" />
          </div>
        </div>
      </section>
    </>
  );
}
