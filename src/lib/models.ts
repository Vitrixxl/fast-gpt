import Anthropic from '@anthropic-ai/sdk';
import { Models } from 'openai/resources/models.mjs';

export const modelsFamily = [
  'gpt',
  'claude',
] as const;
export const models: Models = [
  'gpt-4o-mini', //free
  'gpt-o1',
  'gpt-4o',
  'claude-3-5-sonnet-latest',
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
    label: 'Claude 3.5 Sonnet',
    key: 'claude-3-5-sonnet-latest',
  },
  {
    label: 'GPT-o1',
    key: 'gpt-o1',
  },
];

export const gptSet = ['gpt-4o-mini', 'gpt-4o'] as const;
export const claudeSet = ['claude-3-5-sonnet-latest'] as const;
