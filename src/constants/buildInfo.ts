const formatBuiltAtUtc = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const formatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}-${part('month')}-${part('day')} ${part('hour')}:${part('minute')} UTC`;
};

export const BUILD_INFO = {
  version: __APP_VERSION__,
  builtAt: formatBuiltAtUtc(__APP_DEPLOYED_AT__),
  commit: __APP_COMMIT__,
};
