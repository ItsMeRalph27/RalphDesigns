from pathlib import Path
import shutil, re
base=Path('/mnt/data/rj_update')
html=base/'index.html'
s=html.read_text()
# Add resume button beneath portrait image.
old='''<div class="portrait-frame">\n          <img id="profileImage" class="profile-image" src="assets/profile.jpg" alt="Ralph Designs profile image">\n        </div>'''
new='''<div class="portrait-frame">\n          <img id="profileImage" class="profile-image" src="assets/profile.jpg" alt="Ralph Designs profile image">\n        </div>\n        <a class="button primary magnetic resume-download" href="assets/RJ-Portfolio-Resume.pdf" download="RJ-Portfolio-Resume.pdf" aria-label="Download RJ Portfolio resume">\n          Download Resume <span>↓</span>\n        </a>'''
assert old in s
s=s.replace(old,new,1)
# Add game poster filter button.
old='''<button class="filter-btn" data-filter="don" role="tab" aria-selected="false">DON MACCHIATOS</button>'''
new=old+'''\n        <button class="filter-btn" data-filter="game" role="tab" aria-selected="false">GAME POSTERS</button>'''
assert old in s
s=s.replace(old,new,1)
# Insert four game cards before closing grid, after ACT cards.
marker='''      </div>\n    </section>\n\n    <section class="section process">'''
games='''        <article class="portfolio-picture project" tabindex="0" data-category="game" data-project="game" data-title="CABAL MAXIMUM" data-category-label="GAME POSTER / PORTFOLIO" data-description="Cabal Maximum — Open Beta promotional poster">\n          <div class="portfolio-picture-frame">\n            <span class="picture-number">29</span><span class="picture-open">VIEW ↗</span>\n            <img src="assets/game-01.jpg" alt="Cabal Maximum — Open Beta promotional poster" loading="lazy" decoding="async">\n          </div><div class="portfolio-picture-meta"><span>GAME POSTERS</span><b>VIEW</b></div>\n        </article>\n        <article class="portfolio-picture project" tabindex="0" data-category="game" data-project="game" data-title="CABAL MAXIMUM" data-category-label="GAME POSTER / PORTFOLIO" data-description="Cabal Maximum — Server is Now Up promotional poster">\n          <div class="portfolio-picture-frame">\n            <span class="picture-number">30</span><span class="picture-open">VIEW ↗</span>\n            <img src="assets/game-02.jpg" alt="Cabal Maximum — Server is Now Up promotional poster" loading="lazy" decoding="async">\n          </div><div class="portfolio-picture-meta"><span>GAME POSTERS</span><b>VIEW</b></div>\n        </article>\n        <article class="portfolio-picture project" tabindex="0" data-category="game" data-project="game" data-title="CABAL MAXIMUM" data-category-label="GAME POSTER / PORTFOLIO" data-description="Cabal Maximum — Like & Share promotional poster">\n          <div class="portfolio-picture-frame">\n            <span class="picture-number">31</span><span class="picture-open">VIEW ↗</span>\n            <img src="assets/game-03.jpg" alt="Cabal Maximum — Like and Share promotional poster" loading="lazy" decoding="async">\n          </div><div class="portfolio-picture-meta"><span>GAME POSTERS</span><b>VIEW</b></div>\n        </article>\n        <article class="portfolio-picture project" tabindex="0" data-category="game" data-project="game" data-title="CABAL MAXIMUM" data-category-label="GAME POSTER / PORTFOLIO" data-description="Cabal Maximum — Streamer recruitment promotional poster">\n          <div class="portfolio-picture-frame">\n            <span class="picture-number">32</span><span class="picture-open">VIEW ↗</span>\n            <img src="assets/game-04.jpg" alt="Cabal Maximum — streamer recruitment promotional poster" loading="lazy" decoding="async">\n          </div><div class="portfolio-picture-meta"><span>GAME POSTERS</span><b>VIEW</b></div>\n        </article>\n'''
assert marker in s
s=s.replace(marker, games+marker,1)
html.write_text(s)

# Copy uploaded game images into site assets with clean names.
for src,dst in [
('/mnt/data/game 01.jpg','game-01.jpg'),('/mnt/data/game-02.jpg','game-02.jpg'),('/mnt/data/game 03.jpg','game-03.jpg'),('/mnt/data/game 04.jpg','game-04.jpg')]:
    shutil.copy2(src, base/'assets'/dst)
shutil.copy2('/mnt/data/RJ-Portfolio-Resume.pdf', base/'assets'/'RJ-Portfolio-Resume.pdf')

# CSS enhancements for resume CTA and game category visual.
css=base/'styles.css'
c=css.read_text()
c += '''\n\n/* Resume CTA under profile portrait */\n.resume-download { display:inline-flex; margin:14px auto 0; position:relative; z-index:5; }\n.resume-download span { font-size:1.05em; }\n.filter-btn[data-filter="game"] { border-color: rgba(255, 72, 72, .35); }\n.filter-btn[data-filter="game"].active { box-shadow: 0 0 22px rgba(255, 55, 55, .22); }\n[data-category="game"] .portfolio-picture-frame::after { background: linear-gradient(135deg, rgba(255,20,20,.18), transparent 45%, rgba(255,80,20,.12)); }\n[data-category="game"] .portfolio-picture-meta b { color: #ff4b4b; }\n'''
css.write_text(c)

# Add game count / category description to README.
readme=base/'README.txt'
r=readme.read_text()
r += '\n\nUPDATE: Added GAME POSTERS filter with four Cabal Maximum poster projects and a downloadable RJ Portfolio resume CTA under the profile portrait.\n'
readme.write_text(r)
print('Updated portfolio files.')
