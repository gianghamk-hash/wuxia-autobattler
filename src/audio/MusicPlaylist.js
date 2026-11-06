/** User-supplied recordings, played in this order across every game screen. */
export const MUSIC_PLAYLIST = Object.freeze([
 ['good_b_music-melody-of-nature-main-6672.mp3', 'Melody of Nature'],
 ['nastelbom-asian-asian-china-chinese-music-452940.mp3', 'Asian Journey'],
 ['nourishedbymusic-chinese-flute-sonata-174414.mp3', 'Chinese Flute Sonata'],
 ['soundgallerydt-chinese-china-music-175674.mp3', 'Chinese China Music'],
 ['tunetank-china-chinese-asian-music-349489.mp3', 'China · Asian Music'],
 ['tunetank-cinematic-china-chinese-music-348112.mp3', 'Cinematic China']
].map(([file,title])=>Object.freeze({title,url:new URL('../../assets/audio/'+file,import.meta.url).href})));
