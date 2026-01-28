import { configurableI18n } from '../../configuration'

export function leavingText(secondsToLeave: number): string {
  return secondsToLeave
    ? configurableI18n.__('leaving-guild-text-1', String(secondsToLeave))
    : configurableI18n.__('leaving-guild-text-2')
}
