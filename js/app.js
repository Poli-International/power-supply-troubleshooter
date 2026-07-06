const TREE = {
  start: {
    q: "What is the primary symptom?",
    opts: [
      { icon: '🔌', text: 'Machine will not power on', sub: 'No response when foot pedal pressed', next: 'no_start' },
      { icon: '📊', text: 'Voltage inconsistent or fluctuating', sub: 'Output feels uneven during use', next: 'voltage_issue' },
      { icon: '⚡', text: 'Running too fast or too slow', sub: 'Speed noticeably off from usual settings', next: 'speed_issue' },
      { icon: '🔊', text: 'Excessive noise or vibration', sub: 'Rattling, grinding, or unusual buzzing', next: 'noise_issue' },
      { icon: '🔗', text: 'Cable or connection dropping out', sub: 'Intermittent power loss during use', next: 'connection_issue' },
      { icon: '🌡️', text: 'Machine overheating', sub: 'Gets hot to the touch during a session', next: 'overheat' },
    ],
  },
  no_start: {
    q: "Is the power supply unit showing any indicator lights?",
    opts: [
      { icon: '⚫', text: 'No lights at all — completely dead', next: 'no_start_dead' },
      { icon: '🟢', text: 'Power LED is on but machine does not respond', next: 'no_start_psu_ok' },
      { icon: '🔴', text: 'Error light or blinking indicator', next: null, result: { level: 'service', icon: '⚠️', verdict: 'Power supply error state', sub: 'Consult the PSU manual for your blink code', actions: ['Note the exact blink pattern (count of flashes)', 'Look up the error code in your PSU manual or manufacturer website', 'If no manual available, try a full power cycle (unplug 30 s, replug)', 'If error persists after power cycle, the PSU likely needs replacement or repair'] } },
    ],
  },
  no_start_dead: {
    q: "Check the basics — is the power supply plugged in and the outlet live?",
    opts: [
      { icon: '✅', text: 'Yes — outlet is live, cable is seated', next: null, result: { level: 'stop', icon: '🛑', verdict: 'Power supply internal fault', sub: 'Unit is receiving no power and showing no signs of life', actions: ['Try a different mains cable if the PSU has a detachable IEC/kettle lead', 'Test the outlet with another device to confirm it is live', 'Check for a fuse compartment on the rear of the PSU — replace if blown', 'If none of the above resolves it, the PSU has an internal fault and needs replacement'] } },
      { icon: '❌', text: 'No — something was disconnected', next: null, result: { level: 'ok', icon: '✅', verdict: 'Connection issue — not a fault', sub: 'Secure all connections and try again', actions: ['Plug the mains cable firmly into the PSU and wall outlet', 'Ensure the outlet switch is on (if switched)', 'Press the PSU power button if present', 'If still no response after all connections are confirmed, re-run the troubleshooter'] } },
    ],
  },
  no_start_psu_ok: {
    q: "Are you using a foot pedal / switch?",
    opts: [
      { icon: '🦶', text: 'Yes, foot pedal is connected', next: 'foot_pedal' },
      { icon: '🔌', text: 'No — direct connection or clip cord only', next: null, result: { level: 'check', icon: '🔍', verdict: 'Check RCA / clip cord and machine jack', sub: 'PSU is on but machine is not receiving the signal', actions: ['Unplug and firmly reseat the RCA / clip cord at both ends', 'Inspect the RCA jack on the machine for bent pins or corrosion', 'Test with a different RCA cable if available', 'If still no response, test the machine on a known-working power supply', 'If machine fails on a second PSU, the issue is in the machine motor or contacts'] } },
    ],
  },
  foot_pedal: {
    q: "Does the machine run if you remove the foot pedal and connect the RCA directly (or short the trigger)?",
    opts: [
      { icon: '✅', text: 'Yes — runs without the foot pedal', next: null, result: { level: 'check', icon: '🔍', verdict: 'Foot pedal / switch fault', sub: 'Machine and PSU are working — the foot pedal is the issue', actions: ['Inspect the foot pedal cable for breaks or kinks near the jack', 'Test foot pedal continuity with a multimeter if available', 'Try wiggling the cable while pressing the pedal — intermittent = cable break', 'Replace the foot pedal or get the cable re-soldered at the jack'] } },
      { icon: '❌', text: 'No — still no response without pedal', next: null, result: { level: 'service', icon: '🔧', verdict: 'RCA, machine jack, or motor fault', sub: 'Foot pedal is not the cause — fault is further along the chain', actions: ['Swap to a different RCA cable and test', 'Inspect the machine RCA socket for damage, corrosion, or loose solder joint', 'Check the motor leads inside the machine are secure (if accessible)', 'Test the machine on a second power supply to isolate PSU vs machine fault', 'If motor does not run on any PSU, the machine needs professional servicing'] } },
    ],
  },
  voltage_issue: {
    q: "Is the voltage readout on the PSU display fluctuating or is it steady?",
    opts: [
      { icon: '📈', text: 'Display is bouncing / unstable', next: null, result: { level: 'service', icon: '🔧', verdict: 'Power supply calibration or capacitor fault', sub: 'An unstable readout indicates an internal PSU problem', actions: ['Try running the PSU with no load (no machine connected) — if readout is still unstable, the PSU has an internal fault', 'Check for loose knobs or potentiometer wear — worn voltage dials can cause noise', 'Some budget PSUs drift at very low voltages — test at 6–8 V range', 'If fault persists, the PSU needs recalibration or replacement'] } },
      { icon: '➡️', text: 'Display is steady but machine feels inconsistent', next: 'voltage_connection' },
    ],
  },
  voltage_connection: {
    q: "Is the RCA jack fully seated and free of wobble?",
    opts: [
      { icon: '🔌', text: 'RCA feels loose or clicks in and out', next: null, result: { level: 'check', icon: '🔍', verdict: 'Loose RCA connection', sub: 'An intermittent contact causes voltage dropout during use', actions: ['Unplug and firmly reseat the RCA cable at both ends', 'Inspect the machine RCA socket — if the centre pin is loose, it needs re-soldering', 'Try an alternative RCA cable with a tighter-fitting plug', 'Avoid bending or straining the cable near the jack during use'] } },
      { icon: '✅', text: 'RCA is firm and secure', next: null, result: { level: 'check', icon: '🔍', verdict: 'Check needle depth, stroke, and drive components', sub: 'Connection is fine — mechanical resistance may be causing inconsistency', actions: ['Check needle depth / protrusion — too deep creates back-pressure that loads the motor', 'For rotary machines: inspect the cam wheel for wear or eccentric movement', 'For coil machines: check contact spring tension and gap — a worn front spring causes erratic cycling', 'Ensure the grip and needle module are correctly assembled with no cross-threading', 'Test the machine with a new needle cartridge to rule out a damaged cartridge'] } },
    ],
  },
  speed_issue: {
    q: "Is the machine running faster or slower than expected?",
    opts: [
      { icon: '🐇', text: 'Faster than expected at my usual voltage', next: 'too_fast' },
      { icon: '🐢', text: 'Slower than expected or stalling', next: 'too_slow' },
    ],
  },
  too_fast: {
    q: "What type of machine?",
    opts: [
      { icon: '🖊️', text: 'Rotary pen or cartridge machine', next: null, result: { level: 'check', icon: '🔍', verdict: 'Rotary running fast — check voltage, motor, and needle load', sub: 'Rotaries can appear to run fast if the load is lighter than usual', actions: ['Verify the voltage setting — some PSUs display in Hz or have a separate hertz mode', 'Check that the needle module / cartridge is properly seated (no gap)', 'Test with a different cartridge — a damaged cartridge can reduce back-pressure', 'If using a wireless machine, check battery charge level — some units run faster as battery depletes before cutting off', 'If the machine has a stroke-length adjustment, confirm it matches your setup'] } },
      { icon: '⚡', text: 'Traditional coil machine', next: null, result: { level: 'check', icon: '🔍', verdict: 'Coil running fast — check capacitor and spring gap', sub: 'A worn or blown capacitor is the most common cause of a fast-running coil', actions: ['Inspect the capacitor — a bulging or leaking cap needs replacement', 'Check front spring tension — an overly taut spring increases cycle speed', 'Measure contact gap: standard is approximately 1–1.5 mm. A wider gap increases speed', 'Ensure the contact screw binding post is tight and not rattling', 'Test at a lower voltage setting and see if speed is proportional'] } },
    ],
  },
  too_slow: {
    q: "What type of machine?",
    opts: [
      { icon: '🖊️', text: 'Rotary pen or cartridge machine', next: null, result: { level: 'service', icon: '🔧', verdict: 'Rotary running slow — likely motor wear or excess load', sub: 'A slowing rotary usually points to motor degradation or mechanical binding', actions: ['Increase voltage by 0.5 V increments and note whether speed scales linearly — if not, the motor is worn', 'Check for needle cartridge binding — remove the cartridge and run the motor alone to isolate', 'Inspect the motor shaft for debris or dried lubricant causing drag', 'For high-use machines (200+ hours), motor replacement is often the right call', 'Clean the motor contacts with electrical contact cleaner if accessible'] } },
      { icon: '⚡', text: 'Traditional coil machine', next: null, result: { level: 'check', icon: '🔍', verdict: 'Coil running slow — check contact spring and binding post', sub: 'A sticky or fatigued spring is the most common cause of a slow coil cycle', actions: ['Inspect the front spring for fatigue — a worn spring loses tension and slows the cycle', 'Clean the contact screw and binding post with fine sandpaper or contact cleaner', 'Check the front spring contact gap — too small a gap slows the cycle', 'Ensure the armature bar moves freely with no side-binding', 'Test with fresh binding posts and a new front spring if parts are available'] } },
    ],
  },
  noise_issue: {
    q: "What type of noise?",
    opts: [
      { icon: '🔩', text: 'Rattling or loose part feeling', next: null, result: { level: 'check', icon: '🔍', verdict: 'Mechanical looseness — check assembly', sub: 'Rattles almost always point to a loose component', actions: ['Check needle depth adjustment collar / grip locknut is fully tightened', 'Ensure the needle cartridge is seated and locked — a loose cartridge rattles audibly', 'Inspect the back stem or body screws — tighten any that have loosened from vibration', 'For coil machines, check that the coil binding posts and capacitor are firmly mounted', 'Run the machine at very low voltage with no cartridge to isolate where the rattle originates'] } },
      { icon: '⚙️', text: 'Grinding or scraping sound', next: null, result: { level: 'stop', icon: '🛑', verdict: 'Motor bearing failure — stop use', sub: 'Grinding indicates physical damage inside the motor', actions: ['Stop using the machine immediately — grinding accelerates bearing failure rapidly', 'Do not attempt to lubricate a grinding rotary motor — oil contaminates brushes', 'The motor bearing needs professional replacement or the machine should be sent for service', 'For coil machines, check whether the armature bar is rubbing on the frame — a bent bar causes grinding'] } },
      { icon: '📢', text: 'Loud buzzing (coil machine)', next: null, result: { level: 'check', icon: '🔍', verdict: 'Coil buzz — check mounting and spring contact', sub: 'Excessive buzz on a coil is usually a loose coil core or spring resonance', actions: ['Check that both coil cores are tight in the frame — loose coil mounting amplifies buzzing', 'Inspect the front spring for cracks or a loose contact point at the binding post', 'Try slightly reducing voltage — buzz at high voltage on a coil often indicates over-driving', 'Ensure the capacitor is wired correctly across the binding posts'] } },
      { icon: '🎵', text: 'High-pitched whine (rotary machine)', next: null, result: { level: 'service', icon: '🔧', verdict: 'Motor bearing whine — bearing wear', sub: 'A high-pitched tone indicates early-stage bearing degradation', actions: ['The pitch of the whine often increases as the bearing wears — track progression', 'Some rotary motors can be re-lubricated at the bearing: use a single drop of sewing machine oil on the shaft — do not over-oil', 'If the whine has appeared suddenly, check for debris in the motor housing', 'Plan for motor replacement before full bearing failure — continued use risks scoring the shaft'] } },
    ],
  },
  connection_issue: {
    q: "Is the dropout happening with all RCA cables or just one specific cable?",
    opts: [
      { icon: '🔁', text: 'All cables drop out on this machine', next: null, result: { level: 'service', icon: '🔧', verdict: 'Machine RCA socket fault', sub: 'The fault is in the machine, not the cable', actions: ['Inspect the RCA jack on the machine under a loupe — look for a bent centre pin or broken solder joint', 'Gently clean inside the socket with electrical contact cleaner and a cotton tip', 'If the socket is physically damaged, it needs re-soldering or a socket replacement', 'Test the machine with a clip cord / 2-pin connector if your PSU supports it, to bypass the RCA socket entirely'] } },
      { icon: '1️⃣', text: 'Only one cable drops out — others work fine', next: null, result: { level: 'ok', icon: '✅', verdict: 'Cable is faulty — replace it', sub: 'The machine and PSU are working correctly', actions: ['Dispose of or retire the faulty cable — intermittent cable faults are difficult to repair reliably', 'Inspect where the cable enters the jack at both ends — flexing damage near the plug is the most common failure point', 'Use a new cable and note whether the issue recurs', 'Consider keeping a spare cable in your kit as a standard practice'] } },
      { icon: '❓', text: 'Not sure — have only one cable to test', next: null, result: { level: 'check', icon: '🔍', verdict: 'Test with a known-good cable first', sub: 'You need a second cable to isolate the fault', actions: ['Borrow or purchase a second RCA cable and test — this is the fastest way to isolate the fault', 'While waiting, inspect both ends of your current cable for physical damage, kinks, or loose jacks', 'If a second cable eliminates the issue, retire the original', 'If a second cable also drops out, the fault is in the machine RCA socket or PSU input — re-run the troubleshooter with a confirmed-good cable'] } },
    ],
  },
  overheat: {
    q: "How quickly does the machine overheat?",
    opts: [
      { icon: '⏱️', text: 'Within 10–15 minutes of normal use', next: null, result: { level: 'service', icon: '🔧', verdict: 'Excessive heat — motor wear or over-driving', sub: 'Heating this fast suggests mechanical or electrical stress', actions: ['Check voltage setting — running a rotary at maximum voltage for extended periods degrades motors faster', 'Inspect needle depth / back-pressure — excessive resistance makes the motor work harder and run hotter', 'For coil machines, check contact gap and spring tension — over-tight springs increase heat in the coil', 'Allow the machine to cool for 10 minutes between long sessions as standard practice', 'If the machine has always overheated quickly and is relatively new, contact the manufacturer'] } },
      { icon: '🕐', text: 'After 30–45 minutes of continuous use', next: null, result: { level: 'ok', icon: '✅', verdict: 'Normal thermal behaviour for extended sessions', sub: 'All electric motors generate heat — what you are experiencing may be within spec', actions: ['Monitor grip temperature, not motor body temperature — the machine body warming up is normal', 'Take 5–10 minute breaks between large areas to allow the motor to cool', 'Ensure the machine is not covered or wrapped in a way that blocks airflow', 'If client or artist comfort is an issue, consider a wireless machine with a heat-sink grip'] } },
    ],
  },
};

const wizard = document.getElementById('wizard');
let stack = [];

function depth() {
  const counts = {};
  function count(id, d) {
    if (!TREE[id]) return;
    counts[id] = d;
    TREE[id].opts.forEach(o => { if (o.next && !counts[o.next]) count(o.next, d + 1); });
  }
  count('start', 0);
  return counts;
}
const DEPTHS = depth();
const MAX_DEPTH = Math.max(...Object.values(DEPTHS));

function render(nodeId) {
  const node = TREE[nodeId];
  const d = DEPTHS[nodeId] || 0;
  const pct = Math.round((d / (MAX_DEPTH + 1)) * 100);
  const html = `
    <div class="progress-wrap">
      <div class="progress-label">Step ${d + 1} of ~${MAX_DEPTH + 2}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="step-card">
      <div class="step-question">${node.q}</div>
      <div class="step-options">
        ${node.opts.map((o, i) => `
          <button class="opt-btn" data-idx="${i}">
            <span class="opt-icon">${o.icon}</span>
            <span class="opt-text">${o.text}${o.sub ? `<span class="opt-sub">${o.sub}</span>` : ''}</span>
          </button>`).join('')}
      </div>
    </div>
    ${stack.length > 0 ? '<button class="back-btn">← Back</button>' : ''}`;
  wizard.innerHTML = html;

  wizard.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = node.opts[parseInt(btn.dataset.idx, 10)];
      if (opt.result) { showResult(opt.result); return; }
      if (opt.next) { stack.push(nodeId); render(opt.next); }
    });
  });

  const backBtn = wizard.querySelector('.back-btn');
  if (backBtn) backBtn.addEventListener('click', () => render(stack.pop()));
}

function showResult(r) {
  wizard.innerHTML = `
    <div class="result-card">
      <div class="result-banner level-${r.level}">
        <span class="result-icon">${r.icon}</span>
        <div>
          <div class="result-verdict level-${r.level}">${r.verdict}</div>
          <div class="result-sub">${r.sub}</div>
        </div>
      </div>
      <div class="result-section">
        <div class="result-section-title">Recommended Actions</div>
        <ul class="action-list">${r.actions.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>
    </div>
    <button class="restart-btn">← Start Over</button>`;
  wizard.querySelector('.restart-btn').addEventListener('click', () => { stack = []; render('start'); });
}

render('start');
