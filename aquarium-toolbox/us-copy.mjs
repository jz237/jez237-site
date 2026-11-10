// Customer-facing formulas match the selected input units. Internal arithmetic
// remains SI, so old profiles, backups and shared links retain their meaning.
const formulas={
 tank:'With measurements in inches, US gallons = floor area × height ÷ 231. Floor area: rectangle = length × width. Cylinder = π × (diameter ÷ 2)². Oval = π × longest width × shortest width ÷ 4. Corner (quarter-round) = π × side² ÷ 4. Hexagon = 0.866 × (width across flats)². Bow-front = the rectangle plus the curved segment at the front. Then apply how full it is and the space taken up inside.',
 weight:'Total weight = water volume × water weight (8.345 lb per US gallon fresh, about 8.54 salt) + everything else. Floor load = total weight ÷ stand footprint.',
 substrate:'With dimensions in inches: bed volume (US gal) = length × width × average depth ÷ 231. Weight (lb) = volume × material density (lb/US gal). Round up weight ÷ bag weight, or volume ÷ bag volume.',
 glass:'With dimensions in inches: area (ft²) ≈ (LW + 2LH + 2WH) ÷ 144. Glass weight (lb) ≈ area (ft²) × thickness (in) ÷ 12 × 156.07 lb/ft³.',
 salt:'Salt mix (oz) = water (US gal) × your brand’s amount for 35 ppt (oz/US gal) × (target salinity ÷ 35). Divide ounces by 16 for pounds.',
 pipe:'Speed = flow ÷ pipe opening area. In US units: speed (ft/s) = 0.00681 × flow (US GPH) ÷ inside diameter (in)².',
 heatup:'Energy (kWh) ≈ US gallons × temperature rise (°F) × 0.00245 ÷ the share of heat kept.',
 watercost:'Monthly changes = US gallons × change fraction × 30.4375 ÷ interval. Tap use = (changes + evaporation) × (1 + waste ratio). Water cost = tap gallons ÷ 1,000 × tariff. Salt cost = change gallons × recipe (oz/US gal) ÷ 16 × price per lb.',
 fertilizer:'Fertilizer (g) = rise wanted (ppm) × water (US gal) × 3.785 ÷ [1,000 × nutrient share].'
};
export const formulaFor=(c,us)=>us&&formulas[c.id]?formulas[c.id]:c.formula;
export const descriptionFor=c=>c.description;
export function noteFor(c,us){
 if(us&&c.id==='substrate')return 'Typical dry bulk weights: gravel and sand about 12.5 lb per US gallon of bed, planted-tank soil about 7.5. Products vary from roughly 10 to 13.5 lb for sand and gravel. A bed of 2–3 in suits most planted and community tanks, but this is geometry, not a rule for every plant or fish.';
 return c.note;
}
