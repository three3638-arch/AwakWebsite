import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * PC 首页「AWAK 健康闭环」—— 8 节点齿轮时钟轮（由设计稿 HTML 迁入 React）
 */
export default function ValueProposition() {
  const { t } = useTranslation('common');
  const rootRef = useRef<HTMLElement>(null);
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const clockStageRef = useRef<HTMLDivElement>(null);
  const gearGroupRef = useRef<SVGGElement>(null);
  const gMarkersRef = useRef<SVGGElement>(null);
  const gConnectorsRef = useRef<SVGGElement>(null);
  const handGroupRef = useRef<SVGGElement>(null);
  const cardsLayerRef = useRef<HTMLDivElement>(null);
  const progressDotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const NS = 'http://www.w3.org/2000/svg';
    const CX = 520;
    const CY = 400;
    const CARD_R = 265;
    const RING_V = 200;
    const RING_T = 213;
    const RING_I = 180;
    /** 卡片加宽（布局锚点与连线仍按该宽度计算）；高度基准用于定位，不强制裁切正文 */
    const CARD_W = 220;
    const CARD_H = 102;
    const NUM_TEETH = 72;
    const STAGE_W = 1040;

    const NODES = [
      {
        angle: 0,
        title: '健康记录\n紧急呼救',
        desc: '全天候守护，异常立即预警',
        iconD:
          'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
        iconFill: true,
      },
      {
        angle: 45,
        title: '睡眠质量\n实时记录',
        desc: '深睡分析，修复恢复质量',
        iconD: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
        iconFill: false,
      },
      {
        angle: 90,
        title: '元气晨起\n活力出行',
        desc: '晨间健康评分，活力开启新一天',
        iconD:
          'M12 2v2m0 16v2m-8-10H2m18 0h2M5.64 5.64l-1.41 1.41m13.56 13.56-1.41 1.41M5.64 18.36l-1.41-1.41M18.36 5.64l-1.41-1.41',
        iconFill: false,
      },
      {
        angle: 135,
        title: '饮食记录\n营养账单',
        desc: 'AI识别食物，追踪全天营养摄入',
        iconD: 'M3 11l19-9-9 19-2-8-8-2z',
        iconFill: false,
      },
      {
        angle: 180,
        title: '运动建议\n个性选择',
        desc: '体征驱动的专属个性化训练方案',
        iconD: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
        iconFill: false,
      },
      {
        angle: 225,
        title: '保险体检\n周期管理',
        desc: '联动医疗机构，健康档案完整守护',
        iconD: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        iconFill: false,
      },
      {
        angle: 270,
        title: '时尚出行\n社交认同',
        desc: '外观即态度，科技与美学融合生活',
        iconD: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        iconFill: false,
      },
      {
        angle: 315,
        title: '万物互联\n智慧生活',
        desc: '打通设备生态，数据无缝流转共享',
        iconD: 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
        iconFill: false,
      },
    ] as const;

    const CARD_OFFSETS: Record<number, { dx: number; dy: number }> = {
      0: { dx: -CARD_W / 2, dy: -CARD_H - 16 },
      45: { dx: 16, dy: -CARD_H },
      90: { dx: 16, dy: -CARD_H / 2 },
      135: { dx: 16, dy: 2 },
      180: { dx: -CARD_W / 2, dy: 16 },
      225: { dx: -CARD_W - 16, dy: 2 },
      270: { dx: -CARD_W - 16, dy: -CARD_H / 2 },
      315: { dx: -CARD_W - 16, dy: -CARD_H },
    };

    let activeIdx = 0;
    let handAngle = 0;
    let animReq: number | null = null;
    let autoTimer: ReturnType<typeof setInterval> | null = null;
    let pauseAuto = false;
    let hoverPauseTimer: ReturnType<typeof setTimeout> | null = null;
    let handAnimStart: number | null = null;
    let handFromAngle = 0;
    let handToAngle = 0;
    let handDelta = 0;
    const HAND_DUR = 900;
    const staggerTimeouts: ReturnType<typeof setTimeout>[] = [];

    const gearGroup = gearGroupRef.current;
    const gMarkers = gMarkersRef.current;
    const gConnectors = gConnectorsRef.current;
    const cardsLayer = cardsLayerRef.current;
    const progressDots = progressDotsRef.current;
    const handGroup = handGroupRef.current;
    const stageWrapper = stageWrapperRef.current;
    const clockStage = clockStageRef.current;

    if (!gearGroup || !gMarkers || !gConnectors || !cardsLayer || !progressDots || !handGroup || !stageWrapper || !clockStage) {
      return;
    }

    root.style.setProperty('--vp-hl-card-w', `${CARD_W}px`);
    root.style.setProperty('--vp-hl-card-h', `${CARD_H}px`);

    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function buildGear() {
      const group = gearGroup;
      const step = (2 * Math.PI) / NUM_TEETH;
      let d = '';
      for (let i = 0; i < NUM_TEETH; i++) {
        const a0 = i * step - Math.PI / 2;
        const a1 = a0 + step * 0.27;
        const a2 = a0 + step * 0.4;
        const a3 = a0 + step * 0.6;
        const a4 = a0 + step * 0.73;
        const a5 = (i + 1) * step - Math.PI / 2;
        const pt = (r: number, a: number) =>
          `${(CX + r * Math.cos(a)).toFixed(2)},${(CY + r * Math.sin(a)).toFixed(2)}`;
        if (i === 0) d += `M${pt(RING_V, a0)} `;
        d += `L${pt(RING_T, a1)} `;
        d += `L${pt(RING_T, a2)} `;
        d += `L${pt(RING_T, a3)} `;
        d += `L${pt(RING_T, a4)} `;
        d += `L${pt(RING_V, a5)} `;
      }
      d += 'Z ';
      const NH = 128;
      d += `M${(CX + RING_I).toFixed(2)},${CY.toFixed(2)} `;
      for (let i = 1; i <= NH; i++) {
        const a = -(i / NH) * 2 * Math.PI - Math.PI / 2;
        d += `L${(CX + RING_I * Math.cos(a)).toFixed(2)},${(CY + RING_I * Math.sin(a)).toFixed(2)} `;
      }
      d += 'Z';
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'rgba(255,255,255,0.09)');
      path.setAttribute('fill-rule', 'evenodd');
      path.setAttribute('stroke', 'rgba(255,255,255,0.07)');
      path.setAttribute('stroke-width', '0.5');
      group.appendChild(path);
      const innerRim = document.createElementNS(NS, 'circle');
      innerRim.setAttribute('cx', String(CX));
      innerRim.setAttribute('cy', String(CY));
      innerRim.setAttribute('r', String(RING_I));
      innerRim.setAttribute('fill', 'none');
      innerRim.setAttribute('stroke', 'rgba(255,255,255,0.1)');
      innerRim.setAttribute('stroke-width', '1');
      group.appendChild(innerRim);
      const anim = document.createElementNS(NS, 'animateTransform');
      anim.setAttribute('attributeName', 'transform');
      anim.setAttribute('type', 'rotate');
      anim.setAttribute('from', `0 ${CX} ${CY}`);
      anim.setAttribute('to', `360 ${CX} ${CY}`);
      anim.setAttribute('dur', '50s');
      anim.setAttribute('repeatCount', 'indefinite');
      group.appendChild(anim);
    }

    function buildMarkers() {
      const g = gMarkers;
      NODES.forEach((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const mx = CX + (RING_V - 1) * Math.sin(rad);
        const my = CY - (RING_V - 1) * Math.cos(rad);
        const glow = document.createElementNS(NS, 'circle');
        glow.setAttribute('cx', mx.toFixed(2));
        glow.setAttribute('cy', my.toFixed(2));
        glow.setAttribute('r', '8');
        glow.setAttribute('fill', 'rgba(200,240,0,0)');
        glow.setAttribute('id', `marker-glow-${i}`);
        (glow as unknown as HTMLElement).style.transition = 'fill .4s';
        g.appendChild(glow);
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', mx.toFixed(2));
        dot.setAttribute('cy', my.toFixed(2));
        dot.setAttribute('r', '3.5');
        dot.setAttribute('fill', 'rgba(255,255,255,0.25)');
        dot.setAttribute('id', `marker-dot-${i}`);
        (dot as unknown as HTMLElement).style.transition = 'fill .4s,r .4s';
        g.appendChild(dot);
      });
    }

    function buildConnectors() {
      const g = gConnectors;
      NODES.forEach((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const x1 = CX + (RING_T + 8) * s;
        const y1 = CY - (RING_T + 8) * c;
        const x2 = CX + (CARD_R - 12) * s;
        const y2 = CY - (CARD_R - 12) * c;
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', x1.toFixed(2));
        line.setAttribute('y1', y1.toFixed(2));
        line.setAttribute('x2', x2.toFixed(2));
        line.setAttribute('y2', y2.toFixed(2));
        line.setAttribute('stroke', 'rgba(255,255,255,0.08)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '4 3');
        line.setAttribute('id', `conn-${i}`);
        (line as unknown as HTMLElement).style.transition = 'stroke .4s,stroke-width .4s,opacity .4s';
        g.appendChild(line);
      });
    }

    const cardClickHandlers: Array<() => void> = [];
    const cardEnterHandlers: Array<() => void> = [];
    const cardLeaveHandlers: Array<() => void> = [];
    const pdotClickHandlers: Array<() => void> = [];

    function buildCards() {
      const layer = cardsLayer;
      const dotsCont = progressDots;
      NODES.forEach((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const ax = CX + CARD_R * Math.sin(rad);
        const ay = CY - CARD_R * Math.cos(rad);
        const off = CARD_OFFSETS[node.angle];
        const left = ax + off.dx;
        const top = ay + off.dy;
        const titleLines = node.title.split('\n');
        const fillAttr = node.iconFill
          ? `fill="rgba(255,255,255,0.65)" stroke="none"`
          : `fill="none" stroke="rgba(255,255,255,0.65)"`;
        const card = document.createElement('div');
        card.className = 'vp-hl-node-card';
        card.id = `ncard-${i}`;
        card.style.left = `${Math.round(left)}px`;
        card.style.top = `${Math.round(top)}px`;
        card.style.boxSizing = 'border-box';
        card.style.width = `${CARD_W}px`;
        card.style.minWidth = `${CARD_W}px`;
        card.innerHTML = `
      <div class="vp-hl-card-icon-row">
        <svg class="vp-hl-card-icon" width="16" height="16" viewBox="0 0 24 24"
             ${fillAttr} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <path d="${node.iconD}"/>
        </svg>
      </div>
      <div class="vp-hl-card-title">${titleLines.join('<br>')}</div>
      <div class="vp-hl-card-desc">${node.desc}</div>
      <div class="vp-hl-card-bar"></div>
    `;
        const onClick = () => {
          pauseAuto = false;
          activateNode(i);
          resetAutoTimer();
        };
        const onEnter = () => {
          pauseAuto = true;
          if (hoverPauseTimer) clearTimeout(hoverPauseTimer);
          activateNode(i);
        };
        const onLeave = () => {
          hoverPauseTimer = setTimeout(() => {
            pauseAuto = false;
          }, 1800);
        };
        card.addEventListener('click', onClick);
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
        cardClickHandlers.push(onClick);
        cardEnterHandlers.push(onEnter);
        cardLeaveHandlers.push(onLeave);
        layer.appendChild(card);
        const pdot = document.createElement('div');
        pdot.className = 'vp-hl-pdot';
        pdot.id = `pdot-${i}`;
        pdot.title = node.title.replace('\n', ' ');
        const onPdotClick = () => activateNode(i);
        pdot.addEventListener('click', onPdotClick);
        pdotClickHandlers.push(onPdotClick);
        dotsCont.appendChild(pdot);
      });
    }

    function activateNode(idx: number) {
      activeIdx = idx;
      const node = NODES[idx];
      NODES.forEach((_, i) => {
        const card = document.getElementById(`ncard-${i}`);
        if (card) {
          card.classList.toggle('vp-hl-node-card-active', i === idx);
          card.style.zIndex = i === idx ? '25' : '10';
        }
      });
      NODES.forEach((_, i) => {
        const el = document.getElementById(`pdot-${i}`);
        el?.classList.toggle('vp-hl-pdot-on', i === idx);
      });
      NODES.forEach((_, i) => {
        const dot = document.getElementById(`marker-dot-${i}`);
        const glow = document.getElementById(`marker-glow-${i}`);
        dot?.setAttribute('fill', i === idx ? '#C8F000' : 'rgba(255,255,255,0.25)');
        dot?.setAttribute('r', i === idx ? '5' : '3.5');
        glow?.setAttribute('fill', i === idx ? 'rgba(200,240,0,0.15)' : 'rgba(200,240,0,0)');
      });
      NODES.forEach((_, i) => {
        const conn = document.getElementById(`conn-${i}`);
        if (conn) {
          conn.setAttribute('stroke', i === idx ? 'rgba(200,240,0,0.45)' : 'rgba(255,255,255,0.08)');
          conn.setAttribute('stroke-width', i === idx ? '1.5' : '1');
        }
      });
      animateHand(node.angle);
    }

    function animateHand(targetAngle: number) {
      let delta = targetAngle - handAngle;
      if (delta <= 0) delta += 360;
      if (delta === 360) delta = 0;
      handFromAngle = handAngle;
      handToAngle = targetAngle;
      handDelta = delta;
      handAnimStart = null;
      if (animReq != null) cancelAnimationFrame(animReq);
      animReq = requestAnimationFrame(stepHand);
    }

    function stepHand(ts: number) {
      if (handAnimStart == null) handAnimStart = ts;
      const elapsed = ts - handAnimStart;
      const t = Math.min(elapsed / HAND_DUR, 1);
      const eased = easeInOutCubic(t);
      const currentAngle = handFromAngle + handDelta * eased;
      handAngle = currentAngle % 360;
      handGroup.setAttribute('transform', `translate(${CX},${CY}) rotate(${currentAngle})`);
      if (t < 1) {
        animReq = requestAnimationFrame(stepHand);
      } else {
        handAngle = handToAngle;
        animReq = null;
      }
    }

    function resetAutoTimer() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (pauseAuto) return;
        const next = (activeIdx + 1) % NODES.length;
        activateNode(next);
      }, 3500);
    }

    function rescale() {
      const stage = clockStage;
      const wrapper = stageWrapper;
      const w = window.innerWidth;
      const s = Math.min(w / STAGE_W, 1);
      stage.style.transform = `scale(${s})`;
      stage.style.marginLeft = `${((w - STAGE_W) / 2) * (1 - s)}px`;
      wrapper.style.height = `${800 * s}px`;
    }

    const onResize = () => rescale();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        activateNode((activeIdx + 1) % NODES.length);
        resetAutoTimer();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        activateNode((activeIdx - 1 + NODES.length) % NODES.length);
        resetAutoTimer();
      }
    };

    buildGear();
    buildMarkers();
    buildConnectors();
    buildCards();

    handGroup.setAttribute('transform', `translate(${CX},${CY}) rotate(0)`);

    document.querySelectorAll('.vp-hl-node-card').forEach((c, i) => {
      const el = c as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'scale(0.88)';
      const tid = setTimeout(() => {
        el.style.transition = `opacity .55s cubic-bezier(.16,1,.3,1) ${i * 0.06}s,
                            transform .55s cubic-bezier(.16,1,.3,1) ${i * 0.06}s,
                            border-color .4s, background .4s`;
        el.style.opacity = '0.72';
        el.style.transform = '';
      }, 300 + i * 50);
      staggerTimeouts.push(tid);
    });

    const activateTid = setTimeout(() => {
      activateNode(0);
      resetAutoTimer();
    }, 900);
    staggerTimeouts.push(activateTid);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            root.style.opacity = '1';
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    root.style.opacity = '0';
    root.style.transition = 'opacity .6s ease';
    obs.observe(root);

    rescale();
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      root.style.removeProperty('--vp-hl-card-w');
      root.style.removeProperty('--vp-hl-card-h');
      obs.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKeyDown);
      if (autoTimer) clearInterval(autoTimer);
      if (animReq != null) cancelAnimationFrame(animReq);
      if (hoverPauseTimer) clearTimeout(hoverPauseTimer);
      staggerTimeouts.forEach(clearTimeout);

      document.querySelectorAll('.vp-hl-node-card').forEach((card, i) => {
        card.removeEventListener('click', cardClickHandlers[i]);
        card.removeEventListener('mouseenter', cardEnterHandlers[i]);
        card.removeEventListener('mouseleave', cardLeaveHandlers[i]);
        card.remove();
      });
      progressDots.querySelectorAll('.vp-hl-pdot').forEach((pdot, i) => {
        pdot.removeEventListener('click', pdotClickHandlers[i]);
        pdot.remove();
      });
      gearGroup.innerHTML = '';
      gMarkers.innerHTML = '';
      gConnectors.innerHTML = '';
      root.style.opacity = '';
      root.style.transition = '';
      clockStage.style.transform = '';
      clockStage.style.marginLeft = '';
      stageWrapper.style.height = '';
    };
  }, []);

  return (
    <>
      <style>{`
#vp-hl-root *,#vp-hl-root *::before,#vp-hl-root *::after{box-sizing:border-box}
#vp-hl-root{
  font-family:'DM Sans','Noto Sans SC',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  color:#fff;
}
#vp-hl-root .vp-hl-section{
  width:100%;
  padding:64px 0 80px;
  position:relative;
  background:radial-gradient(ellipse 80% 60% at 50% 48%,rgba(18,22,8,0.9) 0%,#080808 70%);
}
#vp-hl-root .vp-hl-section-header{
  text-align:center;
  margin-bottom:52px;
  position:relative;z-index:10;
  padding:0 24px;
}
#vp-hl-root .vp-hl-section-title{
  font-size:clamp(28px,4vw,42px);
  font-weight:900;letter-spacing:-.05em;
  color:#fff;line-height:1.1;margin-bottom:14px;
}
#vp-hl-root .vp-hl-section-sub{
  font-size:14px;color:rgba(255,255,255,0.42);
  letter-spacing:-.01em;line-height:1.75;
  max-width:640px;margin:0 auto;
}
#vp-hl-root .vp-hl-stage-wrapper{
  width:100%;
  display:flex;
  justify-content:center;
  align-items:flex-start;
  overflow:hidden;
}
#vp-hl-root .vp-hl-clock-stage{
  position:relative;
  width:1040px;
  height:800px;
  flex-shrink:0;
  transform-origin:top center;
}
#vp-hl-root .vp-hl-clock-svg{
  position:absolute;inset:0;
  width:100%;height:100%;
  overflow:visible;
}
#vp-hl-root .vp-hl-cards-layer{
  position:absolute;inset:0;
  pointer-events:none;
}
#vp-hl-root .vp-hl-node-card{
  position:absolute;
  box-sizing:border-box;
  width:var(--vp-hl-card-w,220px) !important;
  min-width:var(--vp-hl-card-w,220px) !important;
  max-width:var(--vp-hl-card-w,220px) !important;
  background:rgba(14,16,9,0.92);
  border:1px solid rgba(255,255,255,0.07);
  border-radius:14px;
  padding:14px 14px 16px;
  pointer-events:all;
  cursor:pointer;
  transition:border-color .4s,background .4s,transform .4s cubic-bezier(.16,1,.3,1),opacity .4s;
  opacity:.72;
}
#vp-hl-root .vp-hl-node-card:hover{
  transform:scale(1.05) !important;
  border-color:rgba(255,255,255,0.16);
  opacity:1;
  z-index:30;
}
#vp-hl-root .vp-hl-node-card-active{
  border-color:rgba(200,240,0,0.38);
  background:rgba(18,22,10,0.96);
  opacity:1;
  z-index:25;
}
#vp-hl-root .vp-hl-node-card-active::after{
  content:'';position:absolute;inset:-1px;
  border-radius:14px;
  background:linear-gradient(135deg,rgba(200,240,0,0.07) 0%,transparent 60%);
  pointer-events:none;
}
#vp-hl-root .vp-hl-card-icon-row{
  display:flex;align-items:center;gap:7px;
  margin-bottom:8px;
}
#vp-hl-root .vp-hl-card-icon{
  flex-shrink:0;
  opacity:.4;transition:opacity .4s;
}
#vp-hl-root .vp-hl-node-card-active .vp-hl-card-icon{opacity:.85}
#vp-hl-root .vp-hl-card-title{
  font-size:14px;font-weight:700;
  letter-spacing:-.02em;line-height:1.32;
  color:rgba(255,255,255,0.65);
  margin-bottom:6px;transition:color .4s;
}
#vp-hl-root .vp-hl-node-card-active .vp-hl-card-title{color:#fff}
#vp-hl-root .vp-hl-card-desc{
  font-size:10.5px;line-height:1.55;
  color:rgba(255,255,255,0.28);
  letter-spacing:-.005em;transition:color .4s;
}
#vp-hl-root .vp-hl-node-card-active .vp-hl-card-desc{color:rgba(255,255,255,0.48)}
#vp-hl-root .vp-hl-card-bar{
  position:absolute;bottom:0;left:50%;
  transform:translateX(-50%);
  height:2px;border-radius:1px;
  background:#C8F000;
  width:0;opacity:0;
  transition:width .45s cubic-bezier(.16,1,.3,1),opacity .3s;
}
#vp-hl-root .vp-hl-node-card-active .vp-hl-card-bar{width:64px;opacity:1}
#vp-hl-root .vp-hl-progress-wrap{
  max-width:400px;margin:36px auto 0;
  display:flex;align-items:center;gap:14px;
  padding:0 24px;
}
#vp-hl-root .vp-hl-progress-dots{
  display:flex;gap:6px;flex-wrap:wrap;justify-content:center;
}
#vp-hl-root .vp-hl-pdot{
  width:5px;height:5px;border-radius:3px;
  background:rgba(255,255,255,0.15);
  cursor:pointer;
  transition:width .3s,background .3s;
}
#vp-hl-root .vp-hl-pdot-on{width:18px;background:#C8F000}
`}</style>

      <section ref={rootRef} id="vp-hl-root" className="relative isolate w-full overflow-x-hidden bg-[#080808]">
        <div className="vp-hl-section">
          <div className="vp-hl-section-header">
            <h2 className="vp-hl-section-title">{t('home.valueLoop.title')}</h2>
            <p className="vp-hl-section-sub">{t('home.valueLoop.subtitle')}</p>
          </div>

          <div ref={stageWrapperRef} className="vp-hl-stage-wrapper">
            <div ref={clockStageRef} className="vp-hl-clock-stage">
              <svg
                className="vp-hl-clock-svg"
                viewBox="0 0 1040 800"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label={t('home.valueLoop.title')}
              >
                <defs>
                  <filter id="vpHlFLimeGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="vpHlFBloom" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="10" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="vpHlFTip" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="vpHlGAmbient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(50,65,15,0.35)" />
                    <stop offset="55%" stopColor="rgba(18,22,8,0.12)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>

                <ellipse cx="520" cy="400" rx="260" ry="240" fill="url(#vpHlGAmbient)" />

                <circle cx="520" cy="400" r="225" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                <g ref={gearGroupRef} />

                <circle
                  cx="520"
                  cy="400"
                  r="176"
                  fill="rgba(255,255,255,0.015)"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />

                <circle cx="520" cy="400" r="148" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                <g ref={gMarkersRef} />

                <g ref={gConnectorsRef} />

                <path
                  id="vpHlActiveArc"
                  fill="none"
                  stroke="rgba(200,240,0,0.22)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0"
                  d=""
                />

                <g ref={handGroupRef}>
                  {/*
                    指针不从 (0,0) 起笔 + 使用 butt，避免圆端帽在圆心处形成「横向粗条」；
                    起笔在轮毂外缘外，视觉上不再横穿表盘中心。
                  */}
                  <line
                    x1="0"
                    y1="-30"
                    x2="0"
                    y2="-172"
                    stroke="#C8F000"
                    strokeWidth="1.4"
                    strokeLinecap="butt"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx="0" cy="-172" r="5" fill="rgba(200,240,0,0.22)" />
                  <circle cx="0" cy="-172" r="3" fill="#C8F000" />
                </g>

                <circle cx="520" cy="400" r="30" fill="none" stroke="rgba(200,240,0,0.1)" strokeWidth="1.5">
                  <animate attributeName="r" values="30;42;30" dur="3.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="3.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="520" cy="400" r="22" fill="none" stroke="rgba(200,240,0,0.18)" strokeWidth="1">
                  <animate attributeName="r" values="22;32;22" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx="520"
                  cy="400"
                  r="18"
                  fill="rgba(12,15,6,0.97)"
                  stroke="rgba(200,240,0,0.28)"
                  strokeWidth="1.5"
                />
                <circle cx="520" cy="400" r="4.5" fill="#C8F000" opacity="0.9" filter="url(#vpHlFTip)" />
              </svg>

              <div ref={cardsLayerRef} className="vp-hl-cards-layer" />
            </div>
          </div>

          <div className="vp-hl-progress-wrap">
            <div ref={progressDotsRef} className="vp-hl-progress-dots" />
          </div>
        </div>
      </section>
    </>
  );
}
