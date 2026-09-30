(() => {
  const products = [
    ['Neon Orbit Hoodie',89],['Voltage Jacket',129],['Burst Signal Tee',45],['Stage Run Sneaker',149],['Crossbody Beat Bag',49],['Vibrant Patch Cap',35],['Starburst Pants',79],['Vibrant Beanie',28],['Nova Headphones',79],['Jacket Patch',12]
  ];
  const positions=['0 0','50% 0','100% 0','0 100%','50% 100%','100% 100%'];
  let cartItems=[];
  const panel=document.createElement('div');
  panel.className='utility-panel';
  document.body.append(panel);
  const imageFor=i=>`assets/product-sheet.png`;
  const positionFor=i=>positions[i%6];
  function close(){panel.classList.remove('open')}
  function draw(kind){
    if(kind==='search') panel.innerHTML=`<section class="utility-surface"><button class="panel-close" aria-label="Close">×</button><h2>SEARCH</h2><input class="search-input" autofocus placeholder="Search the collection"><div class="search-list"></div></section>`;
    if(kind==='account') panel.innerHTML=`<section class="utility-surface"><button class="panel-close" aria-label="Close">×</button><h2>YOUR ACCOUNT</h2><div class="account-card"><b>Make your mark.</b>Sign in to track orders, save favorite drops and unlock early-access releases.</div><button class="panel-action">SIGN IN / CREATE ACCOUNT</button></section>`;
    if(kind==='cart'){
      const lines=cartItems.length?cartItems.map((i,n)=>`<div class="cart-line"><img src="${imageFor(i)}" style="object-position:${positionFor(i)}"><span><b>${products[i][0]}</b><small>$${products[i][1]}.00 · Qty 1</small></span></div>`).join(''):'<p class="cart-empty">Your cart is ready for something bold.</p>';
      const total=cartItems.reduce((sum,i)=>sum+products[i][1],0);
      panel.innerHTML=`<section class="utility-surface"><button class="panel-close" aria-label="Close">×</button><h2>YOUR CART</h2>${lines}<div class="cart-total"><span>SUBTOTAL</span><span>$${total.toFixed(2)}</span></div><button class="panel-action pink">CHECKOUT</button></section>`;
    }
    panel.classList.add('open');
    const closeButton=panel.querySelector('.panel-close'); if(closeButton)closeButton.onclick=close;
    const input=panel.querySelector('.search-input'); if(input){input.focus(); input.oninput=()=>renderResults(input.value);renderResults('')}
  }
  function renderResults(query){const list=panel.querySelector('.search-list'); if(!list)return;const term=query.toLowerCase();const found=products.map((p,i)=>({...p,i})).filter(p=>p[0].toLowerCase().includes(term));list.innerHTML=found.map(p=>`<div class="search-item"><img src="${imageFor(p.i)}" style="object-position:${positionFor(p.i)}"><span><b>${p[0]}</b><small>$${p[1]}.00</small></span><button class="mini-add" data-search-add="${p.i}">+</button></div>`).join('')||'<p class="cart-empty">No pieces found. Try another search.</p>';list.querySelectorAll('[data-search-add]').forEach(btn=>btn.onclick=()=>addToCart(+btn.dataset.searchAdd));}
  function addToCart(index){cartItems.push(index);cart+=1;document.querySelector('#cart').textContent=cart;const msg=document.querySelector('#toast');msg.textContent=`${products[index][0]} added to cart`;msg.classList.add('show');setTimeout(()=>msg.classList.remove('show'),1800);if(panel.classList.contains('open'))draw('cart')}
  document.querySelector('[aria-label="Search"]').onclick=()=>draw('search');
  document.querySelector('[aria-label="Account"]').onclick=()=>draw('account');
  document.querySelector('[aria-label="Cart"]').onclick=()=>draw('cart');
  panel.onclick=e=>{if(e.target===panel)close()};
  function detailImages(){
    const title=document.querySelector('.crumb'); const main=document.querySelector('.main-art'); if(!title||!main||main.dataset.images)return;
    const headphones=title.textContent.includes('NOVA HEADPHONES');
    const productIndex=Math.max(0,products.findIndex(p=>title.textContent.includes(p[0].toUpperCase())));
    const image=headphones?'assets/headphones-detail.png':'assets/product-sheet.png';
    const mainPositions=headphones?['0 0','100% 0','0 100%','100% 100%']:[positionFor(productIndex),positionFor(productIndex),positionFor(productIndex),positionFor(productIndex)];
    main.classList.add('real-product'); main.dataset.images='yes'; main.innerHTML='';
    main.style.backgroundImage=`url(${image})`; main.style.backgroundSize=headphones?'200% 200%':'300% 200%';main.style.backgroundPosition=mainPositions[0];main.style.backgroundRepeat='no-repeat';
    const thumbs=[...document.querySelectorAll('.thumbs button')]; thumbs.forEach((thumb,i)=>{thumb.textContent='';thumb.style.backgroundImage=`url(${image})`;thumb.style.backgroundSize=headphones?'200% 200%':'300% 200%';thumb.style.backgroundPosition=mainPositions[i];thumb.style.backgroundRepeat='no-repeat';thumb.onclick=()=>{main.style.backgroundPosition=mainPositions[i];thumbs.forEach(t=>t.classList.remove('active'));thumb.classList.add('active')}});
  }
  new MutationObserver(detailImages).observe(document.querySelector('#app'),{childList:true,subtree:true});detailImages();
  document.addEventListener('click',e=>{const target=e.target.closest('[data-add]');if(target&&!target.closest('.utility-panel')){const id=Number(target.dataset.add);if(!Number.isNaN(id)){setTimeout(()=>{cartItems.push(id)},0)}}});
})();
