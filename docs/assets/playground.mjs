import * as yup from 'yup';
import { getCountries } from 'libphonenumber-js/max';
import '../../src/index.ts';

const phone = document.getElementById('phone-input');
const country = document.getElementById('country-select');
const strict = document.getElementById('strict-input');
const optional = document.getElementById('optional-input');
const result = document.getElementById('validation-result');
const title = document.getElementById('result-title');
const description = document.getElementById('result-description');
const icon = document.getElementById('result-icon');
const code = document.getElementById('live-code');
const modeHint = document.getElementById('mode-hint');
const feedback = document.getElementById('copy-feedback');

let displayNames;
try {
  displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
} catch {
  // Region codes remain usable in browsers without Intl.DisplayNames.
}
const regions = getCountries()
  .map((value) => ({ value, label: displayNames?.of(value) || value }))
  .sort((a, b) => a.label.localeCompare(b.label, 'en'));
country.replaceChildren(
  ...regions.map(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label + ' (' + value + ')';
    return option;
  }),
);
country.value = 'US';

function render() {
  const region = JSON.stringify(country.value);
  const isStrict = strict.checked;
  const schema = yup.string().phone(country.value, isStrict);
  const activeSchema = optional.checked
    ? yup.lazy((value) =>
        value == null || value === '' ? yup.string().nullable() : schema,
      )
    : schema;
  modeHint.textContent = isStrict
    ? 'Require the number to match the selected region.'
    : 'Use this region for national numbers; accept valid international numbers.';
  code.textContent = optional.checked
    ? [
        'const phone = yup.lazy((value) =>',
        "  value == null || value === ''",
        '    ? yup.string().nullable()',
        '    : yup.string().phone(' + region + ', ' + isStrict + ')',
        ');',
        '',
        'phone.isValidSync(' + JSON.stringify(phone.value) + ');',
      ].join('\n')
    : [
        'const phone = yup.string().phone(' + region + ', ' + isStrict + ');',
        '',
        'phone.isValidSync(' + JSON.stringify(phone.value) + ');',
      ].join('\n');

  try {
    activeSchema.validateSync(phone.value);
    result.dataset.state = 'valid';
    title.textContent =
      phone.value === '' ? 'Empty value allowed' : 'Valid phone number';
    description.textContent =
      phone.value === ''
        ? 'The opt-in lazy schema skips phone validation for an empty value.'
        : isStrict
          ? 'This number matches the selected region’s phone rules.'
          : 'A valid number, with national parsing based on your region.';
    icon.textContent = '✓';
    phone.setAttribute('aria-invalid', 'false');
  } catch (error) {
    result.dataset.state = 'invalid';
    title.textContent = 'Invalid phone number';
    description.textContent =
      phone.value === ''
        ? 'The default phone check rejects an empty value. Try Allow empty values.'
        : error instanceof yup.ValidationError
          ? error.message
          : 'The validator could not check this value.';
    icon.textContent = '×';
    phone.setAttribute('aria-invalid', 'true');
  }
}
phone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    render();
  }
});
for (const control of [phone, country, strict, optional]) {
  control.addEventListener('input', render);
  control.addEventListener('change', render);
}
const examples = {
  us: { value: '(415) 555-2671', region: 'US', strict: true },
  international: { value: '+919876543210', region: 'US', strict: false },
  vanity: { value: '1-800-FLOWERS', region: 'US', strict: true },
  invalid: { value: '123', region: 'US', strict: true },
};
for (const button of document.querySelectorAll('[data-example]')) {
  button.addEventListener('click', () => {
    const example = examples[button.dataset.example];
    phone.value = example.value;
    country.value = example.region;
    strict.checked = example.strict;
    render();
  });
}

function setTab(button, attribute, panelName) {
  const group = button.closest('[role="tablist"]');
  for (const tab of group.querySelectorAll('[role="tab"]')) {
    const selected = tab === button;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (attribute === 'codeTab') {
      document.getElementById('code-' + tab.dataset.codeTab).hidden = !selected;
    }
  }
  if (attribute === 'install') {
    const commands = {
      npm: 'npm install yup yup-phone',
      pnpm: 'pnpm add yup yup-phone',
      yarn: 'yarn add yup yup-phone',
    };
    document.getElementById('install-command').textContent =
      commands[button.dataset.install];
    document
      .getElementById(panelName)
      .setAttribute('aria-labelledby', button.id);
  }
}
for (const group of document.querySelectorAll('[role="tablist"]')) {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const attribute = tabs[0].dataset.install ? 'install' : 'codeTab';
  for (const button of tabs) {
    button.addEventListener('click', () =>
      setTab(button, attribute, 'install-panel'),
    );
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key))
        return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next =
        event.key === 'Home'
          ? tabs[0]
          : event.key === 'End'
            ? tabs[tabs.length - 1]
            : tabs[
                (tabs.indexOf(button) + direction + tabs.length) % tabs.length
              ];
      setTab(next, attribute, 'install-panel');
      next.focus();
    });
  }
}

let feedbackTimer;
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    feedback.textContent = 'Copied to clipboard';
  } catch {
    const focused = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('aria-label', 'Text to copy');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      // Report a manual-copy fallback instead of a false success.
    } finally {
      field.remove();
      focused?.focus({ preventScroll: true });
    }
    feedback.textContent = copied
      ? 'Copied to clipboard'
      : 'Clipboard unavailable. Select the code and copy it manually.';
  }
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => {
    feedback.textContent = '';
  }, 3500);
}
for (const button of document.querySelectorAll('[data-copy]')) {
  button.hidden = false;
  button.addEventListener('click', () => {
    void copyText(document.getElementById(button.dataset.copy).textContent);
  });
}
const quickstartCopy = document.getElementById('copy-quickstart');
quickstartCopy.hidden = false;
quickstartCopy.addEventListener('click', () => {
  const active = document.querySelector('.code-tabs [aria-selected="true"]');
  void copyText(
    document
      .getElementById('code-' + active.dataset.codeTab)
      .querySelector('code').textContent,
  );
});

const themeToggle = document.getElementById('theme-toggle');
themeToggle.hidden = false;
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.setAttribute(
    'aria-label',
    dark ? 'Switch to light theme' : 'Switch to dark theme',
  );
  themeToggle.setAttribute('aria-pressed', String(dark));
}
themeToggle.addEventListener('click', () => {
  const next =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('yup-phone-theme', next);
  } catch {}
  updateThemeButton();
});
updateThemeButton();
for (const label of document.querySelectorAll('[data-version]')) {
  label.textContent = 'v' + __PACKAGE_VERSION__;
}
document.querySelector('[data-runtime]').textContent =
  'yup-phone ' + __PACKAGE_VERSION__ + ' · Yup ' + __YUP_VERSION__;
render();
