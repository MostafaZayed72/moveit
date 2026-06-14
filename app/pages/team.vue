<template>
  <div class="team-page" :class="isDark ? 'dark' : ''">
    <!-- Hero Section -->
    <section class="team-hero">
      <div class="hero-bg-gradient" />
      <div class="container">
        <div class="hero-badge">
          <span>👥</span>
          <span>OUR TEAM</span>
        </div>
        <h1 class="hero-title">Built by Students &amp; Entrepreneurs<br /><span class="hero-title-accent">in Maastricht</span></h1>
        <p class="hero-desc">
          MoveIt was founded with one simple idea: make moving easier, more affordable, and more personal
          for students, expats, and families in Maastricht and across the Limburg region.
        </p>
        <p class="hero-sub">
          Our team combines operational experience, logistics expertise, and deep local knowledge —
          including students who understand exactly what it's like to move in a new city.
        </p>
      </div>
    </section>

    <!-- Team Members -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">🚚 MEET THE TEAM</span>
        </div>

        <!-- Team Grid -->
        <div class="team-grid">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="team-card"
            :class="{ 'featured': member.featured }"
          >
            <!-- Photo / Avatar -->
            <div class="card-photo-wrap">
              <img
                v-if="member.photo"
                :src="member.photo"
                :alt="member.name"
                class="card-photo"
                @error="(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex' }"
              />
              <div class="card-avatar" :style="{ display: member.photo ? 'none' : 'flex' }">
                <svg viewBox="0 0 24 24" fill="currentColor" class="avatar-svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            <!-- Info -->
            <div class="card-body">
              <div class="card-role-tag">{{ member.role }}</div>
              <h2 class="card-name">{{ member.name.split(' ')[0] }}</h2>
              <p class="card-desc">{{ member.desc }}</p>

              <!-- Responsibilities -->
              <ul v-if="member.responsibilities && member.responsibilities.length" class="card-list">
                <li v-for="r in member.responsibilities" :key="r">
                  <span class="list-dot">•</span>{{ r }}
                </li>
              </ul>
            </div>

            <!-- Featured glow -->
            <div v-if="member.featured" class="featured-glow" />
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="vision-section">
      <div class="container">
        <div class="vision-card">
          <div class="vision-icon">💙</div>
          <h2 class="vision-title">Our Vision</h2>
          <p class="vision-intro">We believe moving should feel:</p>
          <div class="vision-values">
            <div v-for="v in visionValues" :key="v.label" class="vision-value">
              <span class="value-icon">{{ v.icon }}</span>
              <span class="value-label">{{ v.label }}</span>
            </div>
          </div>
          <p class="vision-text">
            That's why every move we handle is built on clear communication, flexibility,
            reliability, and community-driven service.
          </p>
          <!-- CTA -->
          <div class="vision-cta">
            <NuxtLink :to="localePath('/contact')">
              <button class="cta-btn">Get an Instant Quote</button>
            </NuxtLink>
            <a href="https://wa.me/31630446034" target="_blank" class="cta-btn cta-btn-ghost">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const localePath = useLocalePath()
const isDark = useDark({ selector: 'html', attribute: 'class', valueDark: 'dark', valueLight: 'light' })

useHead({
  title: 'Our Team | MoveIt Maastricht',
  meta: [
    { name: 'description', content: 'Meet the MoveIt team — students and entrepreneurs in Maastricht dedicated to making your move simple, transparent, and human.' }
  ]
})

const teamMembers = [
  {
    name: 'SHERIF ELIWA',
    role: 'Co-Founder & Operations Lead',
    photo: '/images/team/s.jpg',
    icon: '👨‍💼',
    featured: true,
    desc: 'Sherif holds a Bachelor\'s degree in International Business (Cum Laude) from Zuyd University of Applied Sciences, specializing in Supply Chain Management. He has co-founded multiple ventures in Maastricht across the moving and local services industries since 2018. Today, he focuses fully on building MoveIt into the most trusted moving service in Limburg.',
    responsibilities: [
      'Planning & scheduling',
      'Customer communication',
      'Operational coordination',
      'Quality assurance',
    ],
  },
  {
    name: 'ODAI AL-ASHABAH',
    role: 'Operations Manager',
    photo: null,
    icon: '🚚',
    featured: false,
    desc: 'Odai oversees daily move coordination and on-the-ground operations at MoveIt. He is also the founder of S&S Services, a well-established bike shop in Maastricht\'s city center. His hands-on experience and strong local network keep our operations running smoothly across the region.',
    responsibilities: [],
  },
  {
    name: 'YAZAN',
    role: 'Professional Driver & Mover',
    photo: '/images/team/y.jpg',
    icon: '🚛',
    featured: false,
    desc: 'Yazan is part of MoveIt\'s professional crew, handling transport and logistics across the region with a strong focus on safety and customer experience.',
    responsibilities: [],
  },
  {
    name: 'NICOLA',
    role: 'Student Mover',
    photo: '/images/team/n.jpg',
    icon: '🎓',
    featured: false,
    desc: 'Nicola is a Biomedical Sciences student and part of MoveIt\'s student moving team. He supports students and expats during their relocation across Maastricht.',
    responsibilities: [],
  },
  {
    name: 'QASSEM',
    role: 'Professional Driver & Mover',
    photo: null,
    icon: '🔧',
    featured: false,
    desc: 'Qassem supports local and regional moves as a professional driver and mover, ensuring every transport is reliable and efficient.',
    responsibilities: [],
  },
  {
    name: 'SEBASTIEN',
    role: 'Student Mover',
    photo: '/images/team/se.jpg',
    icon: '🎓',
    featured: false,
    desc: 'Sebastien is a Biomedical Sciences student at Maastricht University. He enjoys helping fellow students and expats relocate smoothly while gaining real-world experience.',
    responsibilities: [],
  },
]

const visionValues = [
  { icon: '✨', label: 'Simple' },
  { icon: '🔍', label: 'Transparent' },
  { icon: '💰', label: 'Affordable' },
  { icon: '🤝', label: 'Human' },
]
</script>

<style scoped>
/* ─── Base ─── */
.team-page {
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
}
.dark .team-page {
  background: #0f172a;
  color: #e2e8f0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ─── Hero ─── */
.team-hero {
  position: relative;
  padding: 9rem 0 5rem;
  overflow: hidden;
  text-align: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1a1a2e 100%);
}
.hero-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 20% 50%, rgba(220,38,38,0.18) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 30%, rgba(59,130,246,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: rgba(220,38,38,0.15);
  border: 1px solid rgba(220,38,38,0.3);
  color: #f87171;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .1em;
  padding: .4rem 1rem;
  border-radius: 999px;
  margin-bottom: 1.75rem;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 1rem;
}
.hero-title-accent {
  background: linear-gradient(90deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  max-width: 680px;
  margin: 0 auto 1rem;
  font-size: 1.1rem;
  color: rgba(255,255,255,.8);
  line-height: 1.7;
}
.hero-sub {
  max-width: 600px;
  margin: 0 auto;
  font-size: .95rem;
  color: rgba(255,255,255,.55);
  line-height: 1.6;
}

/* ─── Team Section ─── */
.team-section {
  padding: 5rem 0 4rem;
}
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}
.section-badge {
  display: inline-block;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .12em;
  color: #ef4444;
  background: rgba(239,68,68,.08);
  border: 1px solid rgba(239,68,68,.2);
  padding: .4rem 1.2rem;
  border-radius: 999px;
}

/* ─── Team Grid ─── */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* ─── Team Card ─── */
.team-card {
  position: relative;
  background: #fff;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,.07);
  border: 1px solid #e2e8f0;
  transition: transform .3s ease, box-shadow .3s ease;
  display: flex;
  flex-direction: column;
}
.dark .team-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 4px 24px rgba(0,0,0,.3);
}
.team-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0,0,0,.12);
}
.dark .team-card:hover {
  box-shadow: 0 16px 48px rgba(0,0,0,.4);
}
.team-card.featured {
  border-color: rgba(239,68,68,.3);
  box-shadow: 0 4px 32px rgba(239,68,68,.1);
}
.team-card.featured:hover {
  box-shadow: 0 16px 56px rgba(239,68,68,.2);
}
.featured-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ef4444, #f97316, #ef4444);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Card Photo ─── */
.card-photo-wrap {
  width: 100%;
  height: 280px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #1e293b, #334155);
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform .4s ease;
}
.team-card:hover .card-photo {
  transform: scale(1.03);
}
.card-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}
.avatar-svg {
  width: 5.5rem;
  height: 5.5rem;
  color: rgba(255, 255, 255, 0.45);
  filter: drop-shadow(0 4px 12px rgba(0,0,0,.3));
}

/* ─── Card Body ─── */
.card-body {
  padding: 1.5rem;
  flex: 1;
}
.card-role-tag {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .1em;
  color: #ef4444;
  text-transform: uppercase;
  margin-bottom: .5rem;
}
.card-name {
  font-size: 1.3rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: .75rem;
  letter-spacing: .02em;
}
.dark .card-name {
  color: #f1f5f9;
}
.card-desc {
  font-size: .875rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 1rem;
}
.dark .card-desc {
  color: #94a3b8;
}
.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: .35rem;
}
.card-list li {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .82rem;
  font-weight: 600;
  color: #475569;
}
.dark .card-list li {
  color: #94a3b8;
}
.list-dot {
  color: #ef4444;
  font-size: 1rem;
  line-height: 1;
}

/* ─── Vision Section ─── */
.vision-section {
  padding: 4rem 0 6rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}
.vision-card {
  max-width: 740px;
  margin: 0 auto;
  text-align: center;
}
.vision-icon {
  font-size: 3rem;
  margin-bottom: 1.25rem;
}
.vision-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: .75rem;
}
.vision-intro {
  font-size: 1.1rem;
  color: rgba(255,255,255,.65);
  margin-bottom: 2rem;
}
.vision-values {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.vision-value {
  display: flex;
  align-items: center;
  gap: .6rem;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.12);
  padding: .7rem 1.4rem;
  border-radius: 999px;
  transition: background .25s, transform .25s;
}
.vision-value:hover {
  background: rgba(239,68,68,.15);
  border-color: rgba(239,68,68,.3);
  transform: translateY(-2px);
}
.value-icon {
  font-size: 1.2rem;
}
.value-label {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
}
.vision-text {
  font-size: 1rem;
  color: rgba(255,255,255,.6);
  line-height: 1.7;
  margin-bottom: 2.5rem;
}
.vision-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .85rem 2rem;
  background: #ef4444;
  color: #fff;
  font-size: .95rem;
  font-weight: 700;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background .2s, transform .2s, box-shadow .2s;
  box-shadow: 0 4px 16px rgba(239,68,68,.35);
  text-decoration: none;
}
.cta-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239,68,68,.45);
}
.cta-btn-ghost {
  background: transparent;
  border: 2px solid rgba(255,255,255,.25);
  color: #fff;
  box-shadow: none;
}
.cta-btn-ghost:hover {
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.5);
  box-shadow: none;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .team-hero { padding: 7rem 0 4rem; }
  .hero-title { font-size: 2rem; }
  .team-grid { grid-template-columns: 1fr; }
  .vision-title { font-size: 1.75rem; }
}
</style>
