// Customer-facing formulas match the selected input units. Internal arithmetic
// remains SI, so old profiles, backups and shared links retain their meaning.
const formulas={
 tank:'With measurements in inches: rectangle = length × width × height ÷ 231 US gal. Cylinder = π × (diameter ÷ 2)² × height ÷ 231. Hexagon = 0.866 × (width across flats)² × height ÷ 231. Bow-front = the rectangle plus the curved segment at the front. Then apply how full it is and the space taken up inside.',
 substrate:'With dimensions in inches: bed volume (US gal) = length × width × average depth ÷ 231. Weight (lb) = volume × material density (lb/US gal). Round up weight ÷ bag weight, or volume ÷ bag volume.',
 glass:'With dimensions in inches: area (ft²) ≈ (LW + 2LH + 2WH) ÷ 144. Glass weight (lb) ≈ area (ft²) × thickness (in) ÷ 12 × 156.07 lb/ft³.',
 salt:'Salt mix (oz) = water (US gal) × your brand’s amount for 35 ppt (oz/US gal) × (target salinity ÷ 35). Divide ounces by 16 for pounds.',
 pipe:'Convert flow from US gallons/hour to cubic feet/second; divide by the pipe cross-sectional area in square feet. Area = π × (inside diameter in feet)² ÷ 4.',
 heatup:'Energy (kWh) ≈ US gallons × 3.785411784 × 4.186 × [temperature rise (°F) × 5/9] ÷ 3,600 ÷ effective fraction.',
 watercost:'Monthly changes = US gallons × change fraction × 30.4375 ÷ interval. Tap use = (changes + evaporation) × (1 + waste ratio). Water cost = tap gallons ÷ 1,000 × tariff. Salt cost = change gallons × recipe (oz/US gal) ÷ 16 × price per lb.',
 fertilizer:'Product (g) = desired nutrient (mg/L) × water (US gal) × 3.785411784 ÷ [1,000 × nutrient mass fraction]. Use grams and mL for precise dosing.'
};
export const formulaFor=(c,us)=>us&&formulas[c.id]?formulas[c.id]:c.formula;
export const descriptionFor=c=>c.description;
export function noteFor(c,us){
 if(us&&c.id==='substrate')return 'Typical dry bulk weights: gravel and sand about 12.5 lb per US gallon of bed, planted-tank soil about 7.5. Products vary from roughly 10 to 13.5 lb for sand and gravel. A bed of 2–3 in suits most planted and community tanks, but this is geometry, not a rule for every plant or fish.';
 return c.note;
}
