const START = 0;
const END = 1;

export type range = [number, number];

export function rangesContain(ranges: range[], start: number, end: number) {
   return ranges.some(range => range[START] <= start && range[END] >= end);
}

export function rangesOverlap(ranges: range[], start: number, end: number) {
   return ranges.some(range => Math.max(start, range[START]) <= Math.min(end, range[END]));
}

interface transition {
   val: number,
   step: number
}


function rangesToTransitions(ranges: range[], endBump = 0) : transition[] {
   // Gather up all transitions (ranges starting or ending). The step will bump a value indicating the number of ranges 
   // overlapping at any given time up one on a start and down one on an end
   const starts = ranges.map(range => ({val: range[START], step:  1}));
   const ends   = ranges.map(range => ({val: range[END] + endBump, step: -1}));
   const transitions = starts.concat(ends);
   // Sort by value, with important secondary sort to put starts first, so we process the start before the end and merge the ranges
   transitions.sort((t1, t2) => t1.val - t2.val || t2.step - t1.step);
   return transitions;
}

function transitionsToRanges(transitions: transition[]) : range[] {
   // Compute new ranges based on when the number of overlapped ranges hits 0/1
   const out = [];
   let overlaps = 0;
   let currentStart: number|undefined;
   for (const transition of transitions) {
      if (!overlaps && transition.step > 0) {
         currentStart = transition.val;
      }
      overlaps += transition.step;
      if (!overlaps && transition.step < 0) {
         out.push([currentStart, transition.val]); 
      }
   } 
   return out as range[];
}

export function addRange(ranges: range[], start: number, end: number) : range[] {
   // Return the same array if we won't be making any changes
   if (rangesContain(ranges, start, end)) {
      return ranges;
   }

   // Throw all existing ranges, existing and new, into one bucket
   const mergedRanges = ranges.concat([[start, end]]);
   const transitions = rangesToTransitions(mergedRanges, 1);  // The endbump 1 is to make [4,5], [6,10] merge into one range... we subtract one from the end of all ranges at the end   
   return transitionsToRanges(transitions).map(r => [r[START],r[END]-1]);  //  -1  to compensate for the +1 we applied above to merge adjacent ranges
}

export function subtractRange(ranges: range[], start: number, end: number) : range[] {
   if (!rangesOverlap(ranges, start, end)) {
      return ranges;
   }
   
   const mergedRanges = ranges.concat([[end+1, start-1]]);
   const transitions = rangesToTransitions(mergedRanges);
   return transitionsToRanges(transitions);
}
