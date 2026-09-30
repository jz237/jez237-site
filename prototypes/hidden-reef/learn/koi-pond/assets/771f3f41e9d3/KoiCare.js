const link=(url,label)=>`<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`;
const ifas=(id,label)=>link(`https://ask.ifas.ufl.edu/publication/${id}`,`UF/IFAS · ${label}`);
const oata='https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-coldwater-fish/';
const merck='https://www.merckvetmanual.com/';
export const careTopics=[
  {id:'begin',group:'Start here',title:'Meet koi: living color, a long commitment',keywords:'size adult carp lifespan beginner anatomy behavior',html:`
    <p>Koi are ornamental domesticated carp, with selectively bred colors and patterns. The fish in this garden have individual names; their variety names describe their appearance. A name does not change a fish’s care needs.</p>
    <p>Notice the broad head, extendable mouth and small barbels beside it. Watch how the body and tail provide thrust while fins help control direction. Koi search their surroundings for food rather than remaining in a single decorative position.</p>
    <p>Plan for large adults and years of care. OATA lists koi reaching about 75 cm (30 in); actual growth varies. Buy for the pond you can maintain as the fish grow. The twenty fish in this virtual garden demonstrate varieties and movement, not a recommended stocking count.</p>
    <p class="reading">${link('https://www.usgs.gov/labs/fish-health-program/science/koi-cyprinus-carpio-koi-fhp','USGS · ornamental koi')} · ${link(oata+'how-to-look-after-pond-fish/','OATA · adult size and care')}</p>`},
  {id:'planning',group:'Start here',title:'Plan the pond before choosing the fish',keywords:'volume gallons depth stocking equipment filtration pump',html:`
    <p>Measure the real water volume, including the operating filter system. An irregular pond’s outside dimensions can overestimate its capacity. Depth, usable swimming space, local winter conditions, filtration, oxygen supply and maintenance access all matter.</p>
    <p>There is no dependable universal “fish per gallon” shortcut. The same count of small juveniles and large adults produces very different waste and oxygen demand. Start conservatively and review capacity as fish grow; a pump’s advertised pond size alone is not a stocking plan.</p>
    <ul><li>Plan safe access to service pumps, drains and filters.</li><li>Allow open swimming space as well as shelter and shade.</li><li>Discuss adult fish size, daily feed load and local weather with your pond installer.</li><li>Include a quarantine system, water tests and backup aeration in the budget.</li></ul>
    <p class="reading">${ifas('FA101','recirculating systems and management')}</p>`},
  {id:'buying',group:'Start here',title:'Choosing, transporting and introducing koi',keywords:'buy purchase shop acclimate bag new fish',html:`
    <p>Watch a potential fish before purchase. Ask how long it has been at the store, whether it is eating, where it came from and what health checks were performed. Look at its companions too. Explain your pond’s size, existing fish, current tests and quarantine plan to the retailer.</p>
    <p>Arrange the shortest practical journey in secure transport packaging, protected from temperature extremes and direct sun. Have the quarantine system ready before leaving to collect the fish. Follow the retailer’s acclimation instructions for the actual travel time and water conditions; avoid an improvised prolonged mixing routine.</p>
    <p>Do not pour transport water into the established pond. Delay purchase if the receiving system is not ready. New fish should pass through quarantine before joining the residents.</p>
    <p class="reading">${link(oata+'how-to-set-up-and-look-after-your-garden-pond/','OATA · preparing a pond and introducing fish')}</p>`},
  {id:'quarantine',group:'Health',title:'Quarantine is part of responsible koi keeping',keywords:'new fish isolation disease khv virus biosecurity',html:`
    <p>Use a separate, adequately sized, filtered and aerated system, with dedicated nets, buckets and hoses. A floating enclosure within the main pond does not isolate shared water. Observe appetite, breathing, skin and swimming every day; test the quarantine water too.</p>
    <p>Merck gives at least 30 days at 24°C (75°F) for koi quarantine. Temperature and disease history affect the plan, so arrange a protocol with an aquatic veterinarian; thirty days in cold water is not an equivalent guarantee. Do not abruptly warm fish to meet a number.</p>
    <p>Care for established fish before quarantine fish and prevent equipment or water from carrying contamination back. Illness means reassessment and diagnosis, not automatic release at the end of a calendar period.</p>
    <p class="reading">${link(merck+'exotic-and-laboratory-animals/aquarium-fish/management-of-aquarium-fish','Merck Veterinary Manual · quarantine')}</p>`},
  {id:'khv',group:'Health',title:'Know about koi herpesvirus (KHV)',keywords:'disease virus infection supplier testing quarantine',html:`
    <p>KHV can cause severe disease in koi and common carp. Appearance alone cannot establish that a fish is free of infection. Ask suppliers about unexplained losses and any laboratory testing; keep purchase and health records for each new group.</p>
    <p>Quarantine and separation reduce the chance of introducing infection. They cannot promise freedom from every pathogen. Do not move sick fish between ponds or offer them to another keeper. A suspected outbreak needs veterinary assessment and appropriate laboratory testing.</p>
    <p>Do not try to “cure” suspected KHV by changing temperature or experimenting with pond medications. A fish veterinarian can explain testing, biosecurity and the next steps for the entire collection.</p>
    <p class="reading">${ifas('VM113','koi herpesvirus')} · ${link('https://fishvets.org/find-a-fish-vet/','Find a fish veterinarian')}</p>`},
  {id:'water',group:'Water',title:'A practical water-quality check',keywords:'ammonia nitrite nitrate ph temperature test numbers limits',html:`
    <p>Clear water can still contain harmful dissolved waste. Use freshwater tests within their expiry date, follow the timing instructions and record results with the water temperature. Compare trends as well as individual readings.</p>
    <div class="care-table"><table><caption>General pond-fish reference from OATA</caption><thead><tr><th>Test</th><th>Reference</th></tr></thead><tbody><tr><td>Ammonia</td><td>Zero detectable</td></tr><tr><td>Nitrite</td><td>Zero detectable</td></tr><tr><td>pH</td><td>6.5–8.5, stable</td></tr><tr><td>Nitrate</td><td>No more than 20 mg/L above source water</td></tr></tbody></table></div>
    <p>These are general references, not a treatment recipe. Check at least weekly in a settled pond and more often after adding fish or when something changes. Test immediately if fish behave abnormally.</p>
    <p class="reading">${link(oata+'how-to-look-after-pond-fish/','OATA · water-quality references')}</p>`},
  {id:'cycle',group:'Water',title:'What the biofilter actually does',keywords:'nitrogen cycle bacteria ammonia nitrite nitrate tan nh3 new pond',html:`
    <p>Fish and decomposing food produce ammonia. Established nitrifying microbes convert ammonia to nitrite and then nitrate. These steps require suitable conditions, including oxygen; biological filtration is a living process, not an instant effect of installing a new box.</p>
    <p>Many tests measure total ammonia nitrogen (TAN): the combined ionized and un-ionized forms. The more toxic un-ionized ammonia fraction increases as pH and temperature rise. A result must be interpreted with those measurements and the units on the kit.</p>
    <p>The Water lab reports nitrogen as mg/L N. A real kit may use other reporting units, so do not compare bare numbers without checking. Establish the biofilter before stocking and monitor it after interruptions or increased feeding.</p>
    <p class="reading">${ifas('FA031','ammonia in aquatic systems')}</p>`},
  {id:'oxygen',group:'Water',title:'Oxygen: warm nights and power cuts',keywords:'air pump aeration gasping summer heat emergency outage waterfall',html:`
    <p>Warm water holds less oxygen. Fish, plants and microbes consume oxygen; plants do not provide oxygen through photosynthesis in darkness. A pond can look peaceful at dusk yet become oxygen-stressed before dawn.</p>
    <p>UF/IFAS identifies dissolved oxygen below 5 mg/L as potentially harmful to fish. This is a useful caution reference, not a guarantee that every reading above it is adequate for every condition. Keep aeration and circulation working, particularly during warm weather and heavy feeding.</p>
    <p>If fish gather at the surface and breathe rapidly, promptly check aeration, circulation and water quality. Restore safe aeration, pause feeding and seek help if distress persists. Prepare a suitable backup air supply before a power cut; a waterfall stops aerating when its pump stops.</p>
    <p class="reading">${ifas('FA002','dissolved oxygen for fish production')}</p>`},
  {id:'buffer',group:'Water',title:'pH, KH and GH are different measurements',keywords:'alkalinity hardness buffer carbonate ph swing chemistry',html:`
    <p>pH describes how acidic or alkaline water is. Total alkalinity describes its acid-neutralizing capacity; pond keepers often track this with a KH test. General hardness (GH) mainly reflects calcium and magnesium. A favorable result for one does not replace the others.</p>
    <p>Low buffering can allow larger pH changes as carbon dioxide varies between day and night. Test pond and source water before deciding whether adjustment is needed. Record the time of day when comparing pH.</p>
    <p>Avoid chasing a precise pH with repeated quick fixes. Have a pond professional interpret the full set of readings and recommend gradual changes if needed. Agricultural pond liming instructions are not a direct dosing plan for a stocked ornamental pond.</p>
    <p class="reading">${ifas('FA028','alkalinity, hardness and pond pH')}</p>`},
  {id:'source',group:'Water',title:'Source water, top-ups and runoff',keywords:'chlorine chloramine tap well rain water change hose overflow',html:`
    <p>Test incoming water rather than assuming it matches the pond. Municipal supplies may contain chlorine or chloramine. Well water can bring low oxygen, dissolved gases or minerals that need attention; natural surface water can carry pollutants and organisms.</p>
    <p>Use an appropriate water conditioner for the actual source and follow its label. Allowing chloraminated water simply to stand is not a reliable preparation method. Plan controlled water changes that avoid sudden temperature or chemistry shifts.</p>
    <p>Protect the pond from fertilizer, pesticide, soap and roof or driveway runoff. After a storm, check equipment, overflow routes, fish behavior and test results. Evaporation top-ups replace lost water; they do not remove the waste left behind.</p>
    <p class="reading">${ifas('FA099','water sources and recirculating systems')} · ${link(merck+'all-other-pets/fish/routine-health-care-of-fish','Merck · routine fish care')}</p>`},
  {id:'feeding',group:'Daily care',title:'Feed the fish you see, not a fixed scoop',keywords:'pellets diet food nutrition portion appetite treats size',html:`
    <p>Choose a complete koi food suited to the fish’s size, life stage and current water temperature. Small mouths need manageable pellets. Offer small portions while watching which fish eat; stop when interest declines and remove leftovers where practical.</p>
    <p>Uneaten food and extra waste burden the system. A fish missing a meal deserves observation rather than an automatic extra handful for the whole pond. Note changes in appetite together with temperature and water tests.</p>
    <p>Keep food cool, dry and sealed, and follow the product’s storage and use-by instructions. Buy an amount you can use while fresh. Discard damp, moldy or rancid food; do not mix it into a new bag.</p>
    <p class="reading">${ifas('FA096','fish nutrition and food storage')}</p>`},
  {id:'nutrition',group:'Daily care',title:'Understanding food labels and color foods',keywords:'protein vitamins minerals pigment carotenoid treat growth diet',html:`
    <p>A complete diet supplies more than protein: fats, essential nutrients, vitamins and minerals matter too. A higher protein percentage alone does not establish that a food is best for your pond, and a single household treat is not a balanced diet.</p>
    <p>Color-enhancing ingredients can supply dietary pigments, but food does not turn one koi variety into another. Select food for health, digestibility, life stage and conditions before the appearance of the packaging or a promise of rapid growth.</p>
    <p>Compare intended use, pellet size, ingredients, storage instructions and the feeding guidance on the label. Ask for help if you are combining foods or caring for fish with different needs. Keep any supplementary treats limited so they do not displace the complete diet.</p>
    <p class="reading">${ifas('FA097','ingredients and balanced fish feeds')}</p>`},
  {id:'season',group:'Daily care',title:'A seasonal rhythm for an outdoor pond',keywords:'spring summer autumn fall winter snow ice cold food temperature',html:`
    <p><strong>Spring:</strong> inspect pumps, filters and plumbing as activity returns. Test before increasing food, and increase gradually with the fish’s activity and the food manufacturer’s temperature guidance.</p>
    <p><strong>Summer:</strong> watch heat, oxygen demand and evaporation. Maintain shade, water movement and an emergency aeration plan. More eager feeding means more waste for the filter.</p>
    <p><strong>Autumn:</strong> intercept falling leaves and remove accumulated organic debris. Prepare winter equipment before freezing weather arrives.</p>
    <p><strong>Winter:</strong> cold fish are less active and feeding requirements change. Maintain appropriate gas exchange without disturbing the fish unnecessarily. Ask a local pond specialist to plan aeration, freeze protection and feeding for your actual depth and climate.</p>
    <p>The snowy scene is a visual season, not evidence that an outdoor pond of any depth can safely overwinter koi.</p>
    <p class="reading">${link('https://www.aquascapeinc.com/water-gardening/seasonal-pond-care/springtime-pond-changes','Aquascape · spring pond changes')} · ${link('https://www.aquascapeinc.com/water-gardening/seasonal-pond-care/fall-winter-pond-maintenance','Aquascape · autumn and winter maintenance')} · ${ifas('FA002','oxygen and temperature')}</p>`},
  {id:'health',group:'Health',title:'Recognize a change before it becomes a crisis',keywords:'sick illness red sore ulcer flashing rubbing clamped fins breathing isolated emergency',html:`
    <p>Learn each fish’s usual appetite, position and swimming style. Repeated rubbing or flashing, clamped fins, rapid breathing, persistent isolation, loss of balance, sores or a sudden appetite change deserve attention. These signs have multiple possible causes; a photo alone rarely establishes a diagnosis.</p>
    <ol><li>Check oxygen supply and equipment immediately.</li><li>Measure water quality and temperature; record the actual numbers.</li><li>Note when the change began, how many fish are affected, recent additions, feed changes and any treatments.</li><li>Contact an aquatic veterinarian for persistent distress, injury, unexplained deaths or rapidly spreading signs.</li></ol>
    <p>Avoid mixing medications or adding salt “just in case.” Diagnosis and accurate pond volume matter. Ask the veterinarian how to collect water or transport a fish before doing so.</p>
    <p class="reading">${link(merck+'all-other-pets/fish/disorders-and-diseases-of-fish','Merck · recognizing fish disease')} · ${link('https://fishvets.org/find-a-fish-vet/','Find a fish veterinarian')}</p>`},
  {id:'varieties',group:'Start here',title:'A small koi-pattern dictionary',keywords:'kohaku sanke showa ogon asagi tancho utsuri doitsu gin rin butterfly metallic longfin',html:`
    <p><strong>Kohaku:</strong> red markings on white. <strong>Sanke:</strong> white, red and black. <strong>Showa:</strong> a different black, red and white pattern family, often with prominent black on the head.</p>
    <p><strong>Ogon:</strong> a single metallic color, such as yellow Yamabuki or white Platinum. <strong>Utsuri:</strong> contrasting black with white, red or yellow. <strong>Asagi:</strong> a blue-gray reticulated back with red along the lower sides.</p>
    <p><strong>Tancho:</strong> a red head marking without other red body markings. <strong>Doitsu:</strong> reduced scales or distinctive large scale rows. <strong>Gin-rin:</strong> reflective scales, which can occur on different varieties. <strong>Longfin/butterfly:</strong> describes fin form, not one color pattern.</p>
    <p>Use Meet the koi to compare the named individuals. Colors and markings help identify a variety; they do not determine a guaranteed personality or exact adult size.</p>
    <p class="reading">${link('https://nwkg.org/koi-identification/','ZNA Northwest · koi identification')}</p>`},
  {id:'routine',group:'Daily care',title:'Your pond notebook and shopping checklist',keywords:'daily weekly maintenance record checklist store customer plants turtle frog compatibility',html:`
    <p><strong>Daily:</strong> look at every fish, check appetite and breathing, confirm the pump and air supply are working, and look for leaks or unusual water levels.</p>
    <p><strong>Weekly and after changes:</strong> log tests and temperature; check accumulated debris and service mechanical filtration according to its instructions. Keep biological media alive and avoid replacing the whole established colony at once.</p>
    <p><strong>Before visiting The Hidden Reef:</strong> bring pond dimensions and estimated volume, pump/filter models, fish count and sizes, recent water readings, food details and photos. This makes a conversation about new fish or equipment much more useful than “the water looks fine.”</p>
    <p>The garden’s turtle, frog, plants and dragonflies are scenic inhabitants, not a ready-made compatibility list. Assess actual species and local conditions before adding animals or plants. Never release unwanted ornamental fish into natural water.</p>
    <p class="reading">${link(merck+'all-other-pets/fish/routine-health-care-of-fish','Merck · routine health care')} · ${link('https://www.usgs.gov/labs/fish-health-program/science/koi-cyprinus-carpio-koi-fhp','USGS · ornamental carp')}</p>`}
];

export function careMarkup(){
  return `<p class="eyebrow">THE HIDDEN REEF · POND COMPANION</p><h2 id="panel-title" tabindex="-1">Know your koi.</h2>
    <p>A practical guide from choosing your first fish to caring for a mature pond. Open a topic or search for something specific.</p>
    <label for="care-search">Find care advice</label><input id="care-search" type="search" placeholder="Try feeding, winter, ammonia…" autocomplete="off">
    <div class="care-filters" role="group" aria-label="Care topics">${['All','Start here','Water','Daily care','Health'].map((v,i)=>`<button data-care-filter="${v}" aria-pressed="${i===0}">${v}</button>`).join('')}</div>
    <p id="care-count" class="fine" role="status">${careTopics.length} topics</p><div id="care-topics">${careTopics.map(t=>`<details class="care-topic" data-care-id="${t.id}"><summary><small>${t.group}</small>${t.title}</summary><div>${t.html}</div></details>`).join('')}</div>
    <p id="care-empty" hidden>No matching topics. Try “food,” “water,” or “health,” or choose All.</p>
    <div class="care-footer"><h3>Watch, then explore.</h3><p>The water lab lets you experiment with oxygen and waste. Its numbers are a teaching model, separate from this animated garden.</p><div class="button-row"><button id="care-water">Open water lab</button><button id="pond-feed" class="primary">Feed the koi ✦</button></div><p class="fine">Care references reviewed September 2026. This guide supports routine husbandry; an aquatic veterinarian can assess illness and treatment.</p></div>`;
}
export function matchingTopics(query,group='All'){
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return careTopics.filter(t=>(group==='All'||group===t.group)&&words.every(w=>`${t.title} ${t.keywords} ${t.html.replace(/<[^>]*>/g,' ')}`.toLowerCase().includes(w))).map(t=>t.id);
}
export function bindCare(body,actions){
  let group='All';const input=body.querySelector('#care-search');
  const filter=()=>{const matches=new Set(matchingTopics(input.value,group));
    for(const d of body.querySelectorAll('[data-care-id]')){d.hidden=!matches.has(d.dataset.careId);d.open=!!input.value.trim()&&!d.hidden;}
    body.querySelector('#care-count').textContent=`${matches.size} ${matches.size===1?'topic':'topics'}`;
    body.querySelector('#care-empty').hidden=matches.size>0;
  };
  input.oninput=filter;
  for(const b of body.querySelectorAll('[data-care-filter]'))b.onclick=()=>{group=b.dataset.careFilter;body.querySelectorAll('[data-care-filter]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));filter();};
  body.querySelector('#care-water').onclick=actions.water;
  body.querySelector('#pond-feed').onclick=actions.feed;
}
