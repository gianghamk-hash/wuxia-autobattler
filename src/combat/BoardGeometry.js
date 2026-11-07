import { CONFIG } from '../config.js';
export const BOARD_COLS = CONFIG.GRID.COLS;
export const BOARD_ROWS = CONFIG.GRID.ROWS;
export const HOME_WIDTH = BOARD_COLS / 2;
export const HOME_COLUMNS = Array.from({length:HOME_WIDTH},(_,x)=>x);
export const ENEMY_COLUMNS = HOME_COLUMNS.map(x=>BOARD_COLS-1-x);
export const ROW_ORDER = [1,0,...Array.from({length:BOARD_ROWS-2},(_,i)=>i+2)];
export const mirrorPosition = p => ({x:BOARD_COLS-1-p.x,y:p.y});
export const ENEMY_SPAWN_CELLS = [
  {x:4,y:1},{x:7,y:0},{x:6,y:3},{x:4,y:3},
  {x:5,y:0},{x:7,y:3},{x:4,y:0},{x:7,y:2}
];

export const CELL_WIDTH=150, CELL_HEIGHT=130;
export const boardLayout=portrait=>({width:(portrait?BOARD_ROWS:BOARD_COLS)*CELL_WIDTH+60,height:(portrait?BOARD_COLS:BOARD_ROWS)*CELL_HEIGHT+160});
