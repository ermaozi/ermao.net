// Fixed vocabulary: never add user input, URLs, query strings or identifiers.
export const TOOL_EVENTS = Object.freeze({
  selector: ['filter_change', 'reset', 'tutorial_click', 'provider_click', 'compare_click'],
  troubleshooter: ['start', 'step_next', 'step_back', 'reset', 'cancel', 'tutorial_click', 'resolved', 'unresolved'],
  vpn: ['selector_click', 'troubleshooter_click', 'tutorial_click', 'provider_click', 'compare_click'],
})

export function validToolEvent(data) {
  return Boolean(data && typeof data === 'object' && !Array.isArray(data)
    && Object.keys(data).length === 2
    && Object.hasOwn(data, 'surface') && Object.hasOwn(data, 'event')
    && Object.hasOwn(TOOL_EVENTS, data.surface)
    && TOOL_EVENTS[data.surface].includes(data.event))
}
