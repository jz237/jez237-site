// Customer-facing formulas match the selected input units. Internal arithmetic
// remains SI, so old profiles, backups and shared links retain their meaning.
const formulas={
 tank:'With dimensions in inches: rectangle = length × width × height ÷ 231 US gal. Cylinder = π × (diameter ÷ 2)² × height ÷ 231. Apply fill and displacement.',
 substrate:'With dimensions in inches: bed volume (US gal) = length × width × average depth ÷ 231. Weight (lb) = volume × material density (lb/US gal). Round up weight ÷ bag weight, or volume ÷ bag volume.',
 glass:'With dimensions in inches: area (ft²) ≈ (LW + 2LH + 2WH) ÷ 144. Glass weight (lb) ≈ area (ft²) × thickness (in) ÷ 12 × 156.07 lb/ft³.',
 salt:'Salt mix (oz) = water (US gal) × the manufacturer’s recipe (oz/US gal). Divide ounces by 16 for pounds.',
 pipe:'Convert flow from US gallons/hour to cubic feet/second; divide by the pipe cross-sectional area in square feet. Area = π × (inside diameter in feet)² ÷ 4.',
 drip:'Flow (US GPH) = drops/second ÷ drops/mL × 3,600 ÷ 3,785.411784. Time = water volume ÷ flow.',
 heatup:'Energy (kWh) ≈ US gallons × 3.785411784 × 4.186 × [temperature rise (°F) × 5/9] ÷ 3,600 ÷ effective fraction.',
 heater:'Planning wattage = water volume (US gal) × selected W/US gal allowance.',
 watercost:'Monthly changes = US gallons × change fraction × 30.4375 ÷ interval. Tap use = (changes + evaporation) × (1 + waste ratio). Water cost = tap gallons ÷ 1,000 × tariff. Salt cost = change gallons × recipe (oz/US gal) ÷ 16 × price per lb.',
 fertilizer:'Product (g) = desired nutrient (mg/L) × water (US gal) × 3.785411784 ÷ [1,000 × nutrient mass fraction]. Use grams and mL for precise dosing.'
};
export const formulaFor=(c,us)=>us&&formulas[c.id]?formulas[c.id]:c.formula;
export const descriptionFor=(c,us)=>us&&c.id==='heater'?'Compare heater wattage using your chosen watts-per-gallon allowance.':c.description;
export function noteFor(c,us){
 if(!us)return c.note;
 if(c.id==='head')return c.note.replace('20°C','68°F');
 if(c.id==='heater')return c.note.replace('W/L','watts-per-gallon');
 if(c.id==='salt')return 'A 35 ppt target is not a recipe for commercial salt: hydration and formulation differ. Use the manufacturer’s recipe and check mixed salinity. Never add dry marine salt directly to an occupied tank.';
 return c.note;
}
