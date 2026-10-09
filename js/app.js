/* Talent ARG - prototipo. Rutas por hash, carrusel y formularios con validación.
   Los registros se guardan en localStorage (solo demostración, sin servidor). */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var IMG = "assets/img/";
  function img(n) { return IMG + n; }
  var PROVINCIAS = ["Buenos Aires","Catamarca","Chaco","Chubut","Ciudad Autónoma de Buenos Aires","Córdoba","Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán"];

  var CLIENTES = [
    { nombre: "Momonga inc.", img: "clientes-momonga.jpg", txt: "Momonga inc. ha aumentado su productividad un 60% e implementado nuevas capacitaciones para usuarios en todo el país." },
    { nombre: "USAGI ENTERPRISE", img: "clientes-usagi.jpg", txt: "Usagi Enterprise es una minera que consiguió nuevos candidatos recibidos de la facultad de minería, y aumentó su productividad." },
    { nombre: "Hachiware Books", img: "clientes-hachiware.jpg", txt: "La librería de Hachiware encontró administradores que aumentaron la efectividad de sus ventas y la organización de sus productos." }
  ];

  var INFO = {
    capacitaciones: ["Capacitaciones", "Cursos y talleres para desarrollar o reforzar tus habilidades.", [["Minería segura", "Para quienes buscan sumarse a empresas mineras."], ["Ventas y atención", "Administración de productos y comercio."], ["Herramientas digitales", "Planillas, gestión y trabajo en equipo."]]],
    empresas: ["Lista de empresas", "Empresas que buscan las capacidades de nuestros usuarios.", [["Momonga inc.", "Capacitaciones en todo el país."], ["Usagi Enterprise", "Minería."], ["Hachiware Books", "Librería y administración."]]],
    planes: ["Planes para empresas", "Elegí cómo presentar tu negocio y encontrar candidatos.", [["Kiwi Emprendedor", "Más publicaciones activas e informes de resultados. Filtros por habilidades y disponibilidad. Mejor panel para administrar candidatos. Comparación de competencias verificadas."]]],
    miembros: ["Miembros", "El equipo detrás de Talent ARG.", [["Cintia Flores", "Diseño del prototipo."]]],
    contacto: ["Contacto", "Escribinos y te respondemos.", [["Correo", "contacto@talentarg.example"], ["Provincia", "Jujuy, Argentina"]]]
  };

  function h(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Vista: carrusel de clientes ---------- */
  var idx = 0, timer = null;
  function viewClientes() {
    app.innerHTML = '<section class="slider" aria-roledescription="carrusel" aria-label="Nuestros clientes">' +
      '<div class="slide-txt"><small>NUESTROS CLIENTES</small><h1></h1><p></p><a class="mas" href="#/elegir">Más info!</a></div>' +
      '<div class="slide-img"><img src="' + img('momonga.png') + '" alt=""></div>' +
      '<div class="dots" role="group" aria-label="Elegir cliente"></div></section>';
    var dots = app.querySelector(".dots");
    CLIENTES.forEach(function (c, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", c.nombre);
      b.onclick = function () { show(i); restart(); };
      dots.appendChild(b);
    });
    show(0); restart();
  }
  function show(i) {
    idx = (i + CLIENTES.length) % CLIENTES.length;
    var c = CLIENTES[idx];
    app.querySelector("h1").textContent = c.nombre;
    app.querySelector(".slide-txt p").textContent = c.txt;
    app.querySelector(".slide-img").style.backgroundImage = "url(" + img(c.img) + ")";
    Array.prototype.forEach.call(app.querySelectorAll(".dots button"), function (b, k) { b.setAttribute("aria-current", k === idx); });
  }
  function restart() {
    clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(function () { show(idx + 1); }, 5000);
  }

  /* ---------- Vista: elegir tipo de cuenta ---------- */
  function viewElegir() {
    app.innerHTML = '<section class="elegir"><a class="back" href="#/clientes"><img src="' + img('taza.png') + '" alt="">VOLVER</a>' +
      '<div class="txt"><p><b>EMPRESA:</b> registrarás a tu equipo para el desarrollo de bienes o servicios.</p><p><b>USUARIO:</b> buscá integrarte en alguna empresa o buscá una capacitación.</p></div>' +
      '<div class="card"><h1>¿Querés registrarte como usuario o como empresa?</h1><div class="roles">' +
      '<button class="role" data-r="empresa"><span>EMPRESA</span><img src="' + img('rol-empresa.png') + '" alt=""></button>' +
      '<button class="role" data-r="usuario"><span>USUARIO</span><img src="' + img('rol-usuario.png') + '" alt=""></button></div></div></section>';
    Array.prototype.forEach.call(app.querySelectorAll(".role"), function (b) { b.onclick = function () { location.hash = "#/" + b.dataset.r; }; });
  }

  /* ---------- Vista: registro / ingreso ---------- */
  var COPY = {
    usuario: { titulo: "Crear una cuenta de Usuario gratuita", nombre: "Nombre de usuario", lista: ["Encontrar capacitaciones para desarrollar y/o reforzarlas", "Buscar lista de empresas que necesiten tus capacidades"], extra: "" },
    empresa: { titulo: "Crear una cuenta de Empresa", nombre: "Nombre de la empresa", lista: ["Presentar tu negocio y ofrecer cupos o solicitar habilidades en áreas específicas", "Ofrecer capacitaciones a usuarios de la página"],
      extra: "<h3>PLANES PARA EMPRESAS:</h3><p><b>KIWI EMPRENDEDOR</b></p><ul><li>Más publicaciones activas e informes de resultados</li><li>Filtros por habilidades y disponibilidad</li><li>Mejor panel para administrar candidatos</li><li>Comparación de competencias verificadas</li></ul>" }
  };
  function viewCuenta(tipo) {
    var c = COPY[tipo], modo = "registro";
    app.innerHTML = '<section class="split"><div class="side"><a class="back" href="#/elegir"><img src="' + img('kiwi.png') + '" alt="">VOLVER</a>' +
      "<h1>" + c.titulo + "</h1><p>CREAR UNA CUENTA DE " + tipo.toUpperCase() + " CONLLEVA:</p><ul>" + c.lista.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul>" + c.extra + "</div>" +
      '<div class="main-r"><p class="hasacct"><span id="q">¿Ya tenés una cuenta?</span><br><button class="link" id="sw" type="button">Ingresá acá!</button></p><h2 id="t"></h2><div id="f"></div></div></section>';
    var sw = app.querySelector("#sw");
    sw.onclick = function () { modo = modo === "registro" ? "ingreso" : "registro"; pintar(); };
    function pintar() {
      var reg = modo === "registro";
      app.querySelector("#q").textContent = reg ? "¿Ya tenés una cuenta?" : "¿Todavía no tenés cuenta?";
      sw.textContent = reg ? "Ingresá acá!" : "Registrate acá!";
      app.querySelector("#t").textContent = reg ? "Registrate en TalentArg" : "Ingresá a TalentArg";
      var campos = [["nombre", c.nombre, "text"]];
      if (reg) campos.push(["pass", "Contraseña", "password"], ["pass2", "Confirmar contraseña", "password"], ["mail", "Correo electrónico", "email"]);
      else campos.push(["pass", "Contraseña", "password"]);
      var html = campos.map(function (f) { return '<label>' + f[1] + '<input name="' + f[0] + '" type="' + f[2] + '" autocomplete="off"><span class="err" data-for="' + f[0] + '"></span></label>'; }).join("");
      if (reg) html += '<label>Provincia<select name="prov">' + PROVINCIAS.map(function (p) { return "<option" + (p === "Jujuy" ? " selected" : "") + ">" + p + "</option>"; }).join("") + "</select></label>";
      html += '<button class="btn" type="submit">' + (reg ? "Crear cuenta" : "Ingresar") + '</button><div id="msg" role="status"></div>';
      var f = app.querySelector("#f");
      f.innerHTML = "<form novalidate>" + html + "</form>";
      f.querySelector("form").onsubmit = function (e) { e.preventDefault(); enviar(e.target, reg, tipo); };
    }
    pintar();
  }
  function enviar(form, reg, tipo) {
    var v = {}; Array.prototype.forEach.call(form.elements, function (el) { if (el.name) v[el.name] = el.value.trim(); });
    var errs = {};
    if (!v.nombre) errs.nombre = "Completá este campo.";
    if (!v.pass || v.pass.length < 6) errs.pass = "Mínimo 6 caracteres.";
    if (reg) {
      if (v.pass2 !== v.pass) errs.pass2 = "Las contraseñas no coinciden.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.mail || "")) errs.mail = "Ingresá un correo válido.";
    }
    Array.prototype.forEach.call(form.querySelectorAll("input"), function (i) { i.setAttribute("aria-invalid", !!errs[i.name]); });
    Array.prototype.forEach.call(form.querySelectorAll(".err"), function (s) { s.textContent = errs[s.dataset["for"]] || ""; });
    var msg = form.querySelector("#msg");
    if (Object.keys(errs).length) { msg.innerHTML = ""; var first = form.querySelector("[aria-invalid=true]"); if (first) first.focus(); return; }
    var db = {}; try { db = JSON.parse(localStorage.getItem("talentarg") || "{}"); } catch (e) {}
    var key = tipo + ":" + v.nombre.toLowerCase();
    if (reg) { db[key] = { tipo: tipo, nombre: v.nombre, mail: v.mail, prov: v.prov, pass: v.pass }; try { localStorage.setItem("talentarg", JSON.stringify(db)); } catch (e) {} msg.innerHTML = '<p class="ok">¡Listo, ' + h(v.nombre) + '! Tu cuenta de ' + tipo + ' fue creada.</p>'; form.reset(); }
    else if (db[key] && db[key].pass === v.pass) msg.innerHTML = '<p class="ok">Bienvenido/a de nuevo, ' + h(db[key].nombre) + '.</p>';
    else msg.innerHTML = '<p class="err">No encontramos esa cuenta. Revisá los datos o registrate.</p>';
  }

  /* ---------- Vista: páginas informativas ---------- */
  function viewInfo(k) {
    var d = INFO[k];
    app.innerHTML = '<section class="info"><h1>' + d[0] + "</h1><p>" + d[1] + '</p><div class="grid">' + d[2].map(function (t) { return '<div class="tile"><h3>' + t[0] + "</h3><p>" + t[1] + "</p></div>"; }).join("") + '</div><a class="link" href="#/elegir">Registrate para ver más</a></section>';
  }

  /* ---------- Router ---------- */
  function route() {
    clearInterval(timer);
    var r = (location.hash || "#/clientes").replace("#/", "");
    if (r === "clientes") viewClientes();
    else if (r === "elegir") viewElegir();
    else if (r === "usuario" || r === "empresa") viewCuenta(r);
    else if (INFO[r]) viewInfo(r);
    else viewClientes();
    Array.prototype.forEach.call(document.querySelectorAll(".dd"), function (d) { d.classList.remove("open"); });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* Menús desplegables */
  Array.prototype.forEach.call(document.querySelectorAll(".dd-btn"), function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var dd = b.parentNode, open = !dd.classList.contains("open");
      Array.prototype.forEach.call(document.querySelectorAll(".dd"), function (d) { d.classList.remove("open"); d.firstElementChild.setAttribute("aria-expanded", "false"); });
      if (open) { dd.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    });
  });
  document.addEventListener("click", function (e) { if (window.matchMedia("(max-width:760px)").matches && e.target.closest && e.target.closest(".nav")) return; Array.prototype.forEach.call(document.querySelectorAll(".dd"), function (d) { d.classList.remove("open"); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") document.dispatchEvent(new Event("click")); });
  var burger = document.querySelector(".burger"), nav = document.getElementById("nav");
  function closeNav() { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function (e) { e.stopPropagation(); var o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  window.addEventListener("hashchange", closeNav);
  route();
})();
