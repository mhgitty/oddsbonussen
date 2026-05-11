const MONTHS_DA = [
  'januar', 'februar', 'marts', 'april', 'maj', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'december',
]

/**
 * Replace [year], [month], [date] tokens with current Danish date values.
 * Safe to call with null/undefined — returns the input unchanged.
 */
export function replaceDateVars(str: string | null | undefined): string {
  if (!str) return str ?? ''
  const now = new Date()
  return str
    .replace(/\[year\]/gi,  now.getFullYear().toString())
    .replace(/\[month\]/gi, MONTHS_DA[now.getMonth()])
    .replace(/\[date\]/gi,  now.getDate().toString())
}

/**
 * Walk a Portable Text block array and replace date tokens in every text span.
 * Returns a new array — does not mutate the original.
 */
export function replaceDateVarsInBlocks(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) return blocks
  return blocks.map((block) => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      return {
        ...block,
        children: block.children.map((child: any) =>
          child._type === 'span' && typeof child.text === 'string'
            ? { ...child, text: replaceDateVars(child.text) }
            : child
        ),
      }
    }
    return block
  })
}
