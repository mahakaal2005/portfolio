/**
 * The problem-solving wall.
 *
 * This is the beat that says "this person can actually think", so it gets real
 * code rather than a decorative texture: a recruiter who reads code will read
 * it, and one who does not still gets the numbers.
 */

export const dsa = {
  /**
   * Two fills the grid exactly — it is `grid-cols-2`, not a three-up row.
   *
   * TODO: replace both with the live LeetCode record — problems solved and
   * global percentile — once the numbers are to hand. The two below are true
   * and verifiable, but a solved count is the figure this section is shaped
   * around, and a self-reported one is worth checking before it goes up.
   */
  stats: [
    { value: 'Java', label: 'primary DSA language' },
    { value: 'Top 5%', label: 'of class at KIET' },
  ],

  /** Named strengths, shown as accent chips beside the wall. */
  topics: ['Graphs  |', 'Dynamic programming  |', 'Heaps  |', 'Trees  |', 'Binary search'],

  platform: { name: 'LeetCode', handle: 'Atul5002' },

  /**
   * Rendered verbatim on the wall. Keep lines under ~62 characters — beyond
   * that they overrun the wall width on a narrow viewport.
   *
   * Java and a heap, deliberately: Java is the language he actually solves in,
   * and this is the same bounded top-k selection that sits behind a "most
   * recent N" query in an app, so it reads as something he uses rather than
   * something he memorised.
   */
  wallCode: `// Top-k by score — O(n log k), not O(n log n)
import java.util.PriorityQueue;

static int[] topK(int[] scores, int k) {
    // Min-heap: the weakest survivor sits on top,
    // so one peek decides whether to bother.
    PriorityQueue<Integer> heap =
        new PriorityQueue<>(k);

    for (int score : scores) {
        if (heap.size() < k) {
            heap.offer(score);
        } else if (score > heap.peek()) {
            // Cheaper than an offer then a poll.
            heap.poll();
            heap.offer(score);
        }
    }

    return heap.stream().mapToInt(Integer::intValue)
               .sorted().toArray();
}`,
} as const
