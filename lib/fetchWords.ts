import { supabase } from './supabase';
import { VocabWord } from './types';

/** Fetch random words using RPC */
export async function fetchRandomWords(count: number = 20): Promise<VocabWord[]> {
  const { data, error } = await supabase.rpc('get_random_vocab', { n: count });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(`Không thể tải từ vựng: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Không tìm thấy từ vựng nào trong cơ sở dữ liệu.');
  }

  return data as VocabWord[];
}

/** Fetch words by ID range (for sequential sections) */
export async function fetchWordsByRange(startId: number, endId: number): Promise<VocabWord[]> {
  const { data, error } = await supabase
    .from('vocab_library')
    .select('id, jp, reading, vi')
    .gte('id', startId)
    .lte('id', endId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(`Không thể tải từ vựng: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Không tìm thấy từ vựng nào trong phạm vi này.');
  }

  return data as VocabWord[];
}

/** Fetch random words within an ID range */
export async function fetchRandomWordsInRange(
  startId: number,
  endId: number,
  count: number
): Promise<VocabWord[]> {
  // Fetch all words in range, then shuffle and take `count`
  const { data, error } = await supabase
    .from('vocab_library')
    .select('id, jp, reading, vi')
    .gte('id', startId)
    .lte('id', endId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(`Không thể tải từ vựng: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Không tìm thấy từ vựng nào trong phạm vi này.');
  }

  // Shuffle and take count
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)) as VocabWord[];
}

/** Get total word count */
export async function getTotalWordCount(): Promise<number> {
  const { count, error } = await supabase
    .from('vocab_library')
    .select('id', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Không thể đếm từ vựng: ${error.message}`);
  }

  return count || 0;
}
