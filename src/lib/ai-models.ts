export const gptModels = [
  'gpt-4o',
  'gpt-4o-mini',
] as const;
export const claudeModels = [
  'claude-3-5-sonnet-latest',
] as const;
export const models = [
  ...gptModels,
  ...claudeModels,
] as const;

export const clientModels = [
  {
    label: 'GPT-4o-mini',
    key: 'gpt-4o-mini',
  },
  {
    label: 'GPT-4o',
    key: 'gpt-4o',
  },
  {
    label: 'Claude 3.5 sonnet',
    key: 'claude-3-5-sonnet-latest',
  },
] as const;
