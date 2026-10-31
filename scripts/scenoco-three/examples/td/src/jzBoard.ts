import { createScoreBoard, type ScoreBoard } from '../../../jez237/scores';

/** jez237.com: one high-score board for the whole page, made the first time a scene asks for it. */
let board: ScoreBoard | null = null;

export function scoreBoard(): ScoreBoard {
  board ??= createScoreBoard({
    game: 'tiny-bastion',
    title: 'TINY BASTION',
    levelLabel: 'MAP',
    accent: '#ffd23f',
    accent2: '#8ee86a',
    panel: 'linear-gradient(160deg,rgba(92,54,24,.96),rgba(43,29,18,.97))',
    font: "'Lilita One', sans-serif",
  });
  return board;
}

export const formatScore = (n: number) => Math.floor(n).toLocaleString('en-US');
