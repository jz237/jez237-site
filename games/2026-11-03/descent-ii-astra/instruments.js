/* Pyro-GX flight instruments. Native Descent still owns targeting, menus and subviews. */
(() => {
  const svg = document.getElementById("astraDeck");
  const frame = new Image();
  frame.src = "flight-deck.png";
  const weaponNames = ["Laser cannon","Vulcan cannon","Spreadfire","Plasma cannon","Fusion cannon","Super laser","Gauss cannon","Helix cannon","Phoenix cannon","Omega cannon"];
  const missiles = ["Concussion","Homing","Proximity mine","Smart missile","Mega missile","Flash missile","Guided missile","Smart mine","Mercury","Earthshaker"];
  document.addEventListener("pointerlockchange",()=>document.body.classList.toggle("deck-captured",document.pointerLockElement===document.getElementById("view")));
  const field = {};
  svg.querySelectorAll("[id]").forEach(node => {field[node.id]=node;});
  const write = (id,val) => {const value=String(val);if(field[id].textContent!==value)field[id].textContent=value;};
  const fmt = n=>String(Math.max(0,n)).padStart(3,"0");
  const cap = n=>Math.max(0,Math.min(100,n));
  let visible=false,lastKey="";
  window.astraDeck = {
    show(wanted) {
      const active=Boolean(wanted && flightActive && frame.complete && frame.naturalWidth);
      if(visible!==active){visible=active;svg.style.display=active?"block":"none";document.body.classList.toggle("has-deck",active);}
      return active;
    },
    update(score,lives,energy,shields,speed,primary,secondary,laser,missileCount,ammo,flags,level,burn,reticle,incoming,heading) {
      const key=[score,lives,energy,shields,speed,primary,secondary,laser,missileCount,ammo,flags,level,burn,reticle,incoming,heading].join("|");
      if(lastKey===key)return;lastKey=key;
      write("deckScore",score.toLocaleString("en-US"));write("deckLives","× "+lives);
      write("deckCourse",String(heading).padStart(3,"0")+"°");
      write("deckSpeed",speed);write("deckEnergy",energy+"%");write("deckShields",shields+"%");
      write("deckPrimary",primary===0&&laser>4?"SUPER LASER":weaponNames[primary]?.toUpperCase()||"PRIMARY");
      write("deckSecondary",missiles[secondary]?.toUpperCase()||"SECONDARY");
      write("deckPrimaryDetail",primary===0||primary===5?((flags&1024)?"QUAD  /  ":"")+"LEVEL "+laser:
        primary===1||primary===6?fmt(ammo)+" ROUNDS":primary===9?ammo+"% CHARGE":"ENERGY FEED");
      write("deckAmmo",fmt(missileCount));write("deckLevel",level<0?"S"+Math.abs(level):"L"+String(level).padStart(2,"0"));
      write("deckAlert",incoming?"MISSILE LOCK":flags&1?"INVULNERABLE":flags&2048?"CLOAKED":shields<25?"SHIELDS LOW":"");
      write("deckBurn",flags&4096?"AFTERBURNER   "+burn+"%":"");
      field.deckEnergyArc.style.strokeDasharray=cap(energy)+" 100";
      field.deckShieldArc.style.strokeDasharray=cap(shields)+" 100";
      field.deckShields.style.fill=shields<25?"#ff9a62":"#edfaff";
      field.deckReticle.style.display=reticle?"":"none";
      field.deckRounds.style.opacity=missileCount?"1":".48";
      ["Blue","Red","Gold"].forEach((name,i)=>{field["deckKey"+name].style.opacity=flags&(2<<i)?"1":".16";});
      field.deckGun.setAttribute("color",["#6ce8ff","#f6bb73","#a1ef80","#6aefb4","#da96ff","#78ddff","#e3b97e","#f9a6ad","#ff986c","#a4bdff"][primary]||"#79e7ff");
      field.deckMine.style.display=secondary===2||secondary===7?"":"none";
      field.deckMissile.style.display=secondary===2||secondary===7?"none":"";
    }
  };
})();
