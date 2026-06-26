const stage = document.querySelector('.stage')
const grid = document.querySelector('.grid')
const close = document.querySelector('.close')
let mPos = { x: 50, y: 50 }
let i = 0

const localImages = [
	new URL('./assets/img/1.jpg', import.meta.url).href,
	new URL('./assets/img/2.jpg', import.meta.url).href,
	new URL('./assets/img/3.jpg', import.meta.url).href,
	new URL('./assets/img/10.jpg', import.meta.url).href,
	new URL('./assets/img/11.jpg', import.meta.url).href,
	new URL('./assets/img/12.jpg', import.meta.url).href,
	new URL('./assets/img/13.jpg', import.meta.url).href,
	new URL('./assets/img/4.jpg', import.meta.url).href,
	new URL('./assets/img/5.jpg', import.meta.url).href,
	new URL('./assets/img/6.jpg', import.meta.url).href,
	new URL('./assets/img/7.jpg', import.meta.url).href,
	new URL('./assets/img/8.jpg', import.meta.url).href,
	new URL('./assets/img/9.jpg', import.meta.url).href,
	new URL('./assets/img/14.jpg', import.meta.url).href
]

for (let x = 1; x < 10; x++)
	for (let y = 1; y < 10; y++) {
		i++
		makePt(x * 10, y * 10)
	}

function makePt(x, y) {
	const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	const img = document.createElementNS('http://www.w3.org/2000/svg', 'image')
	const depth = gsap.utils.random(0.8, 1)
	grid.append(g)
	g.appendChild(img)
	gsap.set(g, {
		x: x,
		y: y,
		attr: { class: 'pt' },
		svgOrigin: '50 50',
		scale: depth,
	})
	gsap.set(img, {
		attr: {
			class: 'img',
			id: 'img' + i,
			href: localImages[i % localImages.length],
		},
	})
	gsap.to(img, { duration: 0.5, x: -7, y: -7, attr: { width: 14, height: 14 } })

	img.onpointerenter = e => {
		// gsap.to(img, {opacity:0.25})
	}

	img.onpointerleave = e => {
		// gsap.to(img, {opacity:1})
	}

	img.onpointerup = e => {
		gsap
			.timeline()
			.set(
				'.hero image',
				{
					attr: {
						width: 94,
						height: 94,
						x: 3,
						y: 3,
						href: img.getAttribute('href'),
					},
				},
				0
			)
			.to('.tip', { ease: 'power3.inOut', scale: 0 }, 0)
			.to('.img', { opacity: 0 }, 0)
			.to('.hero', { autoAlpha: 1 }, 0.5)
	}
}

close.onpointerup = e => {
	gsap
		.timeline()
		.to('.hero', { autoAlpha: 0 }, 0)
		.set('.hero image', { attr: { href: '' } }, 0.5)
		.to('.img', { opacity: 1 }, 0.5)
}

function redraw(t) {
	const img = t.querySelector('image')
	const x = gsap.getProperty(t, 'x')
	const y = gsap.getProperty(t, 'y')
	const dist = Math.abs(x - mPos.x) + Math.abs(y - mPos.y)
	gsap.to(img, {
		duration: 0.7,
		scale: Math.max(1 - dist / 100, 0),
		attr: { x: x - mPos.x, y: y - mPos.y },
	})
	// sort group layers to fix z-index
}

window.onpointermove = e => {
	const domPt = new DOMPoint(e.x, e.y)
	let svgPt = domPt.matrixTransform(stage.getScreenCTM().inverse())
	gsap.set(mPos, { x: svgPt.x, y: svgPt.y })
	gsap.to('.tip', { x: e.x, y: e.y, ease: 'expo' })
	pts.forEach(redraw)
}

const pts = document.querySelectorAll('.pt')
gsap.to(mPos, {
	duration: 1,
	ease: 'expo.in',
	x: 50,
	y: 50,
	onUpdate: () => {
		pts.forEach(redraw)
	},
})

gsap.set('.tip', { scale: 0, transformOrigin: '0 15px', pointerEvents: 'none' })
gsap.set('.tip *', { y: -50, xPercent: -50 })
gsap.set('.close', { x: 90, y: 5 })
gsap.set('.hero', { autoAlpha: 0 })
function splitToSpans(el) {
	const childNodes = Array.from(el.childNodes);
	let newHtml = '';
	childNodes.forEach(node => {
		if (node.nodeType === Node.TEXT_NODE) {
			const chars = node.textContent.split('');
			chars.forEach(char => {
				if (char.trim() !== '') {
					newHtml += `<span class="char" style="display:inline-block">${char}</span>`;
				} else {
					newHtml += char;
				}
			});
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			if (node.tagName.toLowerCase() === 'br') {
				newHtml += '<br>';
			} else {
				const chars = node.textContent.split('');
				let innerHtml = '';
				chars.forEach(char => {
					if (char.trim() !== '') {
						innerHtml += `<span class="char" style="display:inline-block">${char}</span>`;
					} else {
						innerHtml += char;
					}
				});
				newHtml += `<${node.tagName.toLowerCase()} class="${node.className}">${innerHtml}</${node.tagName.toLowerCase()}>`;
			}
		}
	});
	el.innerHTML = newHtml;
}

document.querySelectorAll('.title, .credit').forEach(el => {
	splitToSpans(el);
	
	gsap.from(el.querySelectorAll('.char'), {
		duration: 0.8,
		y: 20,
		opacity: 0,
		stagger: 0.15,
		ease: 'back.out(2)',
		delay: 0.3
	});

	el.querySelectorAll('.char').forEach(charEl => {
		charEl.addEventListener('mouseenter', () => {
			gsap.fromTo(charEl, 
				{ y: -15 },
				{ duration: 0.6, y: 0, ease: 'back.out(4)', overwrite: 'auto' }
			);
		});
	});
});
