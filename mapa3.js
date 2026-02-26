window.onload = function () {
        const gridContainer = document.querySelector('.grid-container');
        let clickedDivs = [];
        let kliknuti = [];
        let lista_trokutova = [];
        let trokut = [];
        let lista_dostupnih = Array.from({ length: 81 }, (_, i) => i);
        //let lista_dostupnih = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
        let moguci_potez = true;
        let igrac = 1;
        let igrac_prvi = localStorage.getItem("ime1");
        let igrac_drugi = localStorage.getItem("ime2");
        let boja1 = localStorage.getItem("boja1");
        let boja2 = localStorage.getItem("boja2");
        let boja = boja1;
        let trenutni_gejm_igrao = 1

        let vrhovi_okvira = [gridContainer.clientWidth / 2, 0, 0, gridContainer.clientHeight, gridContainer.clientWidth, gridContainer.clientHeight];

        let ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = gridContainer.clientWidth;
        ctx.canvas.height = gridContainer.clientHeight;


        crtaj_okvir_mape();
        
        for (let i = 0; i < 81; i++) {
                const div = document.createElement('div');
                div.classList.add('grid-item');
                div.id = i;
                gridContainer.appendChild(div);

                izbaci_viska_tipke(div);

                div.addEventListener('click', function () {
                        if (!kliknuti.includes(div) && moguci_potez) {
                                clickedDivs.push(div);
                                div.classList.add('kliknut');

                                if (clickedDivs.length === 3) {
                                        drawTriangle(clickedDivs);
                                        clickedDivs = [];
                                        provjera_mogucih_poteza();
                                }
                        }
                });
        }

        function drawTriangle(divs) {

                var offsets = document.getElementById('ploca').getBoundingClientRect();
                var top = offsets.top;
                var left = offsets.left;

                const coords = [];
                let rect = divs[0].getBoundingClientRect();
                coords[0] = { x: rect.left + rect.width / 2 - left, y: rect.top + rect.height / 2 - top };
                rect = divs[1].getBoundingClientRect();
                coords[1] = { x: rect.left + rect.width / 2 - left, y: rect.top + rect.height / 2 - top };
                rect = divs[2].getBoundingClientRect();
                coords[2] = { x: rect.left + rect.width / 2 - left, y: rect.top + rect.height / 2 - top };



                trokut[0] = Math.floor(coords[0].x);
                trokut[1] = Math.floor(coords[0].y);
                trokut[2] = Math.floor(coords[1].x);
                trokut[3] = Math.floor(coords[1].y);
                trokut[4] = Math.floor(coords[2].x);
                trokut[5] = Math.floor(coords[2].y);

                for (let i = 0; i < lista_trokutova.length; i++) {
                        if (doesTriangleIntersect(trokut, lista_trokutova[i])) {
                                clickedDivs.forEach(d => d.classList.remove('kliknut'));

                                return 0;
                        }
                }

                if (provjera_ispravnosti_trokuta(trokut)) {

                        ctx.strokeStyle = boja;
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.moveTo(coords[0].x, coords[0].y);
                        ctx.lineTo(coords[1].x, coords[1].y);
                        ctx.lineTo(coords[2].x, coords[2].y);
                        ctx.closePath();
                        ctx.stroke();
                        lista_trokutova.push(trokut);

                        for (let div of divs) {
                                for (let j = 0; j < lista_dostupnih.length; j++) {
                                        if (lista_dostupnih[j] == div.id) {
                                                lista_dostupnih.splice(j, 1);
                                                break;
                                        }
                                }
                                kliknuti.push(div);
                        }

                        if (igrac == 1) {
                                igrac = 2;
                                boja = boja2;
                        } else if (igrac == 2) {
                                igrac = 1;
                                boja = boja1;
                        }
                } else {
                        clickedDivs.forEach(d => d.classList.remove('kliknut'));
                }

                trokut = [];

                gridContainer.appendChild(ctx.canvas);
                ctx.canvas.style.position = 'absolute';
                ctx.canvas.style.top = '0';
                ctx.canvas.style.left = '0';
        }

        function nadi_x_i_y(polje) {

                let offsets = document.getElementById('ploca').getBoundingClientRect();
                let top = offsets.top;
                let left = offsets.left;

                let rect = polje.getBoundingClientRect();

                let x_px = Math.floor(rect.left + rect.width / 2 - left);
                let y_px = Math.floor(rect.top + rect.height / 2 - top);
                let par = [x_px, y_px];
                return par;
        }

        function provjera_ispravnosti_trokuta(trokut) {
                let p = (1 / 2) * (trokut[0] * (trokut[3] - trokut[5]) + trokut[2] * (trokut[5] - trokut[1]) + trokut[4] * (trokut[1] - trokut[3]));
                if (p == 0) {
                        return false;
                } else if (duzina_duzi(trokut)) {
                        return false;
                }
                return true;
        }

        function duzina_duzi(trokut) {
                let x1 = trokut[0];
                let y1 = trokut[1];
                let x2 = trokut[2];
                let y2 = trokut[3];
                let x3 = trokut[4];
                let y3 = trokut[5];

                let duzina1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                let duzina2 = Math.sqrt(Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2));
                let duzina3 = Math.sqrt(Math.pow(x1 - x3, 2) + Math.pow(y1 - y3, 2));

                console.log("duzine")
                console.log(duzina1, duzina2, duzina3);

                let najduzi = Math.max(duzina1, duzina2, duzina3);
                let rezultat;

                if (duzina1 > duzina2 && duzina1 > duzina3) {
                        rezultat = duzina2 + duzina3;
                } else if (duzina2 > duzina1 && duzina2 > duzina3) {
                        rezultat = duzina1 + duzina3;
                } else if (duzina3 > duzina1 && duzina3 > duzina2) {
                        rezultat = duzina1 + duzina2;
                }

                if (Math.abs(najduzi - rezultat) <= 0.1) {
                        return true;
                } else {
                        return false;
                }

        }

        function provjera_mogucih_poteza() {
                for (let i = 0; i < lista_dostupnih.length; i++) {
                        let tacka1 = document.getElementById(lista_dostupnih[i]);
                        for (let j = 1; j < lista_dostupnih.length; j++) {
                                let tacka2 = document.getElementById(lista_dostupnih[j]);
                                for (let k = 2; k < lista_dostupnih.length; k++) {
                                        let tacka3 = document.getElementById(lista_dostupnih[k]);
                                        let pomocni_trokut = [];
                                        let par = nadi_x_i_y(tacka1);
                                        pomocni_trokut[0] = par[0];
                                        pomocni_trokut[1] = par[1];
                                        par = nadi_x_i_y(tacka2);
                                        pomocni_trokut[2] = par[0];
                                        pomocni_trokut[3] = par[1];
                                        par = nadi_x_i_y(tacka3);
                                        pomocni_trokut[4] = par[0];
                                        pomocni_trokut[5] = par[1];

                                        if (lista_trokutova.length == 0) {
                                                return 0;
                                        }

                                        for (let z = 0; z < lista_trokutova.length; z++) {
                                                if (provjera_ispravnosti_trokuta(pomocni_trokut) && !doesTriangleIntersect(pomocni_trokut, lista_trokutova[z])) {
                                                        console.log("pomocni trokut");
                                                        console.log(pomocni_trokut);
                                                        return 0;
                                                }
                                        }
                                }
                        }
                }
                moguci_potez = false;
                document.getElementById("nestani").style.display = "none";
                document.getElementById("revans").style.display = "flex";
                document.getElementById("revans").addEventListener("click", restart);
                if (igrac == 1) {
                        igrac = 2;
                        document.getElementById("pobjednik").innerHTML = "Pobijedio je igrac " + igrac_drugi;
                } else if (igrac == 2) {
                        igrac = 1;
                        document.getElementById("pobjednik").innerHTML = "Pobijedio je igrac " + igrac_prvi;
                }
        }

        function doesTriangleIntersect(newTriangle) {
                for (let trokut of lista_trokutova) {
                        if (trianglesIntersect(newTriangle, trokut)) {
                                return true;
                        }
                }
                return false;
        }

        function trianglesIntersect(t1, t2) {
                const segmentsT1 = [
                        [{ x: t1[0], y: t1[1] }, { x: t1[2], y: t1[3] }],
                        [{ x: t1[2], y: t1[3] }, { x: t1[4], y: t1[5] }],
                        [{ x: t1[4], y: t1[5] }, { x: t1[0], y: t1[1] }]
                ];
                const segmentsT2 = [
                        [{ x: t2[0], y: t2[1] }, { x: t2[2], y: t2[3] }],
                        [{ x: t2[2], y: t2[3] }, { x: t2[4], y: t2[5] }],
                        [{ x: t2[4], y: t2[5] }, { x: t2[0], y: t2[1] }]
                ];

                for (let [p1, p2] of segmentsT1) {
                        for (let [q1, q2] of segmentsT2) {
                                if (segmentsIntersect(p1, p2, q1, q2)) {
                                        return true;
                                }
                        }
                }
                return false;
        }

        function segmentsIntersect(p1, p2, q1, q2) {
                function orientation(p, q, r) {
                        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
                        if (val === 0) return 0;  
                        return (val > 0) ? 1 : 2; 
                }

                const o1 = orientation(p1, p2, q1);
                const o2 = orientation(p1, p2, q2);
                const o3 = orientation(q1, q2, p1);
                const o4 = orientation(q1, q2, p2);

                if (o1 !== o2 && o3 !== o4) return true;

                return false;
        }

        function restart() {
                document.getElementById("nestani").style.display = "block";
                document.getElementById("revans").style.display = "none";
                lista_dostupnih = Array.from({ length: 81 }, (_, i) => i);
                //lista_dostupnih = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
                moguci_potez = true;
                kliknuti = [];
                lista_trokutova = [];
                ctx.canvas.width = gridContainer.clientWidth;
                ctx.canvas.height = gridContainer.clientHeight;
                for (let i = 0; i < 81; i++) {
                        document.getElementById(i).classList.remove('kliknut');

                        let d = document.getElementById(i);

                        izbaci_viska_tipke(d);
                }
                if (trenutni_gejm_igrao == 1) {
                        trenutni_gejm_igrao = 2;
                        igrac = 2;
                        boja = boja2;
                } else if (trenutni_gejm_igrao == 2) {
                        trenutni_gejm_igrao = 1;
                        igrac = 1;
                        boja = boja1;
                }
        }

        function crtaj_okvir_mape() {
                var elemDiv = document.createElement('canvas');
                document.getElementById('ploca').appendChild(elemDiv);
                let actx = elemDiv.getContext('2d');
                elemDiv.classList.add('okvir');

                let s = gridContainer.clientWidth;
                let v = gridContainer.clientHeight;

                actx.canvas.width = s;
                actx.canvas.height = v;
                actx.strokeStyle = "black";
                actx.lineWidth = 5;
                actx.beginPath();
                actx.moveTo(s / 2, 0);
                actx.lineTo(0, v);
                actx.lineTo(s, v);
                actx.closePath();
                actx.stroke();
        }

        function izbaci_viska_tipke(div) {
                var offsets = document.getElementById('ploca').getBoundingClientRect();
                var top = offsets.top;
                var left = offsets.left;

                let rect = div.getBoundingClientRect();
                let kordinate = { x: rect.left + rect.width / 2 - left, y: rect.top + rect.height / 2 - top };


                if (odrediStranuPrave(vrhovi_okvira[4], vrhovi_okvira[5], vrhovi_okvira[0], vrhovi_okvira[1], kordinate.x, kordinate.y) || odrediStranuPrave(vrhovi_okvira[0], vrhovi_okvira[1], vrhovi_okvira[2], vrhovi_okvira[3], kordinate.x, kordinate.y)) {
                        div.classList.add('kliknut');
                        for (let j = 0; j < lista_dostupnih.length; j++) {
                                if (lista_dostupnih[j] == div.id) {
                                        lista_dostupnih.splice(j, 1);
                                        break;
                                }
                                kliknuti.push(div);
                        }
                }
        }

        function odrediStranuPrave(x1, y1, x2, y2, x, y) {
             
                const orijentacija = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);

                if (orijentacija > 0) {
                        
                        return true;
                } else if (orijentacija < 0) {
                        
                        return false;
                } else {
                        
                        return false;
                }
        }
}



