import { useEffect, useMemo, useState } from "react";
import "./styles.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DELIVERY = 50;
const DRAWER_W = 420;

const products = [
  { id: "set-21", title: "Yumbox 21 сет", weight: 1500, price: 799, image: "/img/set21.png" },
  { id: "set-22", title: "Yumbox 22 сет", weight: 1500, price: 799, image: "/img/set21.png" },
  { id: "set-23", title: "Yumbox 23 сет", weight: 1500, price: 799, image: "/img/set21.png" },
  { id: "set-24", title: "Yumbox 24 сет", weight: 1500, price: 799, image: "/img/set21.png" },
  { id: "set-25", title: "Yumbox 25 сет", weight: 1500, price: 799, image: "/img/set21.png" },
  { id: "set-26", title: "Yumbox 26 сет", weight: 1500, price: 799, image: "/img/set21.png" },
  { id: "set-27", title: "Yumbox 27 сет", weight: 1500, price: 799, image: "/img/set21.png" },
  { id: "set-28", title: "Yumbox 28 сет", weight: 1500, price: 799, image: "/img/set21.png" },

];

const slidesDesktop = [
  { id: 1, src: "/img/slide-1.png", alt: "slide 1" },
  { id: 2, src: "/img/slide-2.png", alt: "slide 2" },
  { id: 3, src: "/img/slide-3.png", alt: "slide 3" },
];

const slidesMobile = [
  { id: 1, src: "/img/slide-m-1.png", alt: "slide mobile 1" },
  { id: 2, src: "/img/slide-m-2.png", alt: "slide mobile 2" },
  { id: 3, src: "/img/slide-m-3.png", alt: "slide mobile 3" },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setIsScrolled(window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totals = useMemo(() => {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = subtotal >= 1000 ? subtotal * 0.1 : 0;
    const delivery = count > 0 ? DELIVERY : 0;
    const total = subtotal - discount + delivery;
    return { count, subtotal, discount, delivery, total };
  }, [cart]);

  const qtyById = useMemo(() => {
    const m = new Map();
    cart.forEach((i) => m.set(i.id, i.qty));
    return m;
  }, [cart]);

  const openCart = () => {
    setIsMenuOpen(false);
    setIsCartOpen(true);
  };
  const closeCart = () => setIsCartOpen(false);

  const toggleMenu = () => {
    setIsCartOpen(false);
    setIsMenuOpen((v) => !v);
  };
  const closeMenu = () => setIsMenuOpen(false);

  const goTo = (hash) => {
    window.location.hash = hash;
    closeMenu();
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const inc = (id) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  const remove = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const checkout = () => {
    console.log(cart.map(({ id, title, price, qty }) => ({ id, title, price, qty })));
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className={`page ${isCartOpen ? "cartOpen" : ""}`} style={{ "--drawerW": `${DRAWER_W}px` }}>
      {/* HEADER */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="headerInner">
          <img className="logoImg" src="/img/logo.png" alt="yumbox" />

          <nav className="nav">
            <a href="#catalog">Каталог</a>
            <a href="#catering">Кейтеринг</a>
            <a href="#about">Про нас</a>
            <a href="#contacts">Контакти</a>
          </nav>

          <div className="headerRight">
            <button className="cartPill " onClick={openCart}>
              <span className="badgeCount">{totals.count}</span>
              <span>{Math.round(totals.total)} грн</span>
            </button>

            <button className="burgerBtn mobileOnly" onClick={toggleMenu} aria-label="menu">
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      
      <button className="cartPill cartPillFloating mobileOnly " onClick={openCart}>
        <span className="badgeCount">{totals.count}</span>
        <span>{Math.round(totals.total)} грн</span>
      </button>

      
      {isMenuOpen && <div className="menuOverlay" onClick={closeMenu} />}
      <aside className={`mobileMenu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobileMenuHead">
          <img className="logoImg logoImgMobile" src="/img/logo.png" alt="yumbox" />
          <div className="mobileMenuRight">
            <div className="mobileMenuLabel">Меню</div>
            <button className="mobileMenuClose" onClick={closeMenu} aria-label="close menu">
              ✕
            </button>
          </div>
        </div>

        <button className="cartPill cartPillMenu" onClick={openCart}>
          <span className="badgeCount">{totals.count}</span>
          <span>{Math.round(totals.total)} грн</span>
        </button>

        <div className="mobileLinks">
          <button onClick={() => goTo("#catalog")}>Каталог</button>
          <button onClick={() => goTo("#catering")}>Кейтеринг</button>
          <button onClick={() => goTo("#about")}>Про нас</button>
          <button onClick={() => goTo("#contacts")}>Контакти</button>
        </div>
        <div className="mobileMenuContacts mobileOnly">
  <a href="mailto:yumbox.lutsk@gmail.com" className="menuEmail">
    yumbox.lutsk@gmail.com
  </a>

  <div className="menuPhone">
   <strong> +380 93 823 92 93</strong>
  </div>

  <div className="menuSocials">
    <img src="/img/linkedin.png" alt="linkedin" />
    <img src="/img/instagram.png" alt="instagram" />
    <img src="/img/facebook.png" alt="facebook" />
  </div>
</div>
      </aside>

      
      <main className={`container ${isCartOpen ? "blurred" : ""}`}>
        
        <section className="hero">
          <div className="heroWrap">
            <button className="heroNav heroPrev desktopOnly" aria-label="prev slide">
              <img src="/img/arrow-left.png" alt="" />
            </button>
            <button className="heroNav heroNext desktopOnly" aria-label="next slide">
              <img src="/img/arrow-right.png" alt="" />
            </button>

            <div className="desktopOnly desktopHero">
              <Swiper
                modules={[Navigation, Pagination]}
                loop
                slidesPerView={1}
                navigation={{ prevEl: ".heroPrev", nextEl: ".heroNext" }}
                pagination={{ clickable: true }}
                className="heroSwiper heroSwiperDesktop"
              >
                {slidesDesktop.map((s) => (
                  <SwiperSlide key={s.id}>
                    <div className="heroSlide heroSlideDesktop">
                      <img className="heroImg" src={s.src} alt={s.alt} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="mobileOnly">
              <Swiper
                modules={[Navigation, Pagination]}
                loop
                slidesPerView={1}
                navigation={{ prevEl: ".heroPrevM", nextEl: ".heroNextM" }}
                pagination={{ clickable: true }}
                className="heroSwiper heroSwiperMobile"
              >
                {slidesMobile.map((s) => (
                  <SwiperSlide key={s.id}>
                    <div className="heroSlide heroSlideMobile">
                      <img className="heroImg heroImgMobile" src={s.src} alt={s.alt} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="heroMobileNavRow">
                <button className="heroNavM heroPrevM" aria-label="prev slide">
                  <img src="/img/arrow-left.png" alt="" />
                </button>
                <button className="heroNavM heroNextM" aria-label="next slide">
                  <img src="/img/arrow-right.png" alt="" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <h2 className="sectionTitle">Найчастіше замовляють</h2>

        <section className="grid" id="catalog">
          {products.map((p) => {
            const qty = qtyById.get(p.id) || 0;
           /* const sum = qty * p.price;*/

            return (
              <article className="product" key={p.id}>
                <img className="productImg" src={p.image} alt={p.title} />

                <div className="productTitle">
                  Yumbox <br /> {p.id.replace("set-", "")} сет
                </div>

                <div className="productMeta">{p.weight} гр</div>

                <div className="productAction">
  <div className="productPrice">{p.price} грн</div>

  {qty > 0 ? (
    <button className="btnInCart hoverBtn" onClick={openCart}>
      <span className="okDot" />
      В кошику {qty} шт
    </button>
  ) : (
    <button className="btnOutline hoverBtn" onClick={() => addToCart(p)}>
      Додати в кошик
    </button>
  )}
</div>
              </article>
            );
          })}
        </section>
      </main>

      {isCartOpen && <div className="cartBlur" onClick={closeCart} />}

      <aside className={`drawer ${isCartOpen ? "open" : ""}`} aria-hidden={!isCartOpen}>
        <div className="drawerHead">
          <div className="drawerTitle">Корзина</div>
          <button className="closeBtn" onClick={closeCart} aria-label="close">
            ✕
          </button>
        </div>

        <div className="drawerBody">
          {cart.length === 0 ? (
            <div className="empty">Кошик порожній</div>
          ) : (
            cart.map((item) => (
              <div className="cartCard" key={item.id}>
                <div className="cartTop">
                  <img className="cartMiniImg" src={item.image} alt={item.title} />

                  <div className="cartText">
                    <div className="cartTitle">{item.title}</div>
                    <div className="cartMeta">{item.weight} гр</div>
                  </div>

                  <button className="deleteBtn" onClick={() => remove(item.id)} aria-label="remove">
                    <img src="/img/trash.png" alt="trash" />
                  </button>
                </div>

                <div className="cartBottom">
                  <div className="cartPriceBig">{item.price} ₴</div>

                  <div className="qtyPill">
                    <button className="qtyBtn" onClick={() => dec(item.id)} aria-label="minus">
                      –
                    </button>
                    <div className="qtyVal">{item.qty}</div>
                    <button className="qtyBtn plus" onClick={() => inc(item.id)} aria-label="plus">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawerFoot">
          <div className="row">
            <span>Доставка</span>
            <b>{totals.delivery} ₴</b>
          </div>

          {totals.discount > 0 && (
            <div className="row">
              <span>Знижка 10% (від 1000)</span>
              <b>-{Math.round(totals.discount)} ₴</b>
            </div>
          )}

          <div className="row total">
            <span>Разом</span>
            <b>{Math.round(totals.total)} ₴</b>
          </div>

          <button className="checkoutBtn" disabled={totals.count === 0} onClick={checkout}>
            оформити за {Math.round(totals.total)} ₴
          </button>
        </div>
      </aside>
    </div>
  );
}