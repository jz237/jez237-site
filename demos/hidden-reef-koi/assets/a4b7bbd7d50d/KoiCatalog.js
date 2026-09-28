// Indices match the actual instanced fish roster in GardenEngine.js.
const descriptions={
 kohaku:['Kohaku','White · red','White koi with red (hi) markings. A clear white base and the placement of red patches define this classic variety.'],
 sanke:['Taisho Sanke','White · red · black','A white base with red markings and smaller black (sumi) accents. Sanke and Showa are distinct three-color varieties.'],
 yamabuki:['Yamabuki Ogon','Metallic yellow','A single metallic yellow color. Light reveals the orderly overlapping scales and the sheen of the skin.'],
 showa:['Showa Sanshoku','Black · red · white','Black, red and white patterning, commonly with black extending onto the head and around the body.'],
 orenji:['Orenji Ogon','Metallic orange','A warm orange metallic koi. This individual also has reflective gin-rin scales.'],
 karasu:['Karasu','Black','A dark, nearly black koi. It can disappear into the deeper water until its silhouette catches the light.'],
 tancho:['Tancho','White · red crown','A white koi whose red marking is confined to a spot on the head.'],
 bekko:['Shiro Bekko','White · black','A white base with discrete black markings along the back.'],
 asagi:['Asagi','Blue-gray · red','Blue-gray reticulated scales across the back, with red or orange on the sides and fins.'],
 platinum:['Platinum Ogon','Metallic white','A silvery-white metallic koi. This individual has longer, flowing fins.'],
 chagoi:['Chagoi','Brown · bronze','A single-color brown koi with a visible scale pattern. The calm, curious foraging in this scene is an individual behavior, not a guarantee for every fish.'],
 shiroutsuri:['Shiro Utsuri','Black · white','Bold black and white markings extend across the body and head.'],
 hiutsuri:['Hi Utsuri','Black · red','Strong red and black patterning from the Utsurimono group.'],
 kujaku:['Kujaku','Metallic white · red · netted scales','A metallic koi with red markings and dark reticulation over its scales. This individual has long fins.'],
 doitsu:['Doitsu koi','White · red · mirror scales','Doitsu describes the reduced scale covering: smooth skin with large mirror scales along selected rows.'],
 goshiki:['Goshiki','Red · white · dark reticulation','A complex patterned koi combining red markings with a darker, reticulated base.'],
 benigoi:['Benigoi','Deep red','A nonmetallic, solid red koi with an uninterrupted color field.'],
 ochiba:['Ochiba Shigure','Gray · brown','Brown patches over a gray base suggest fallen leaves on water.']
};
const roster=['kohaku','sanke','yamabuki','showa','orenji','karasu','tancho','bekko','sanke','asagi','platinum','chagoi','shiroutsuri','hiutsuri','kujaku','doitsu','goshiki','benigoi','ochiba','kohaku'];
export const varieties=roster.map((id,i)=>{const [name,colors,note]=descriptions[id];return{id,name:name+(i===8?' · juvenile':i===19?' · gin-rin':''),colors,note};});
