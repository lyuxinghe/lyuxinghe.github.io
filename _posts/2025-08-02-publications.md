---
title: "Publications"
bg: turquoise  #defined in _config.yml, can use html color like '#0fbfcf'
color: black   #text color
fa-icon: book
---

### Publications and Pre-Prints

<div class="pub-list">
  <article class="pub-card">
    <div class="pub-media">
      <video autoplay muted loop playsinline preload="metadata" aria-label="ParticleSplat video preview">
        <source src="{{ 'img/publications/particlesplat-short-20s.mp4' | relative_url }}" type="video/mp4">
      </video>
    </div>
    <div class="pub-body">
      <h3 class="pub-title">ParticleSplat: Self-supervised Object-centric Latent Particle Splatting</h3>
      <p class="pub-authors"><strong><span class="highlight-accent">Lyuxing He</span></strong>, Daniel Guo, Elizabeth Terveen, Deepak Pathak, David Held, Tal Daniel</p>
      <p class="pub-venue"><strong><a href="https://arxiv.org/pdf/2609.19463">Preprint</a></strong></p>
      <p class="pub-abstract">ParticleSplat is a self-supervised representation learning method using feedforward Gaussian splatting that learns 3D object decomposition without supervision or priors, enabling scene editing and robotic manipulation.</p>
      <div class="pub-links">
        <a href="https://arxiv.org/pdf/2609.19463">Paper</a>
        <a href="https://lyuxinghe.github.io/ParticleSplat-website/">Website</a>
        <a href="https://github.com/lyuxinghe/ParticleSplat">Code</a>
      </div>
    </div>
  </article>
</div>

<div class="pub-list">
  <article class="pub-card">
    <div class="pub-media">
      <img src="{{ 'img/publications/tax3dv2.gif' | relative_url }}" alt="3DGP">
    </div>
    <div class="pub-body">
      <h3 class="pub-title">Disentangled Point Diffusion for Precise Object Placement</h3>
      <p class="pub-authors"><strong><span class="highlight-accent">Lyuxing He<sup aria-label="equal contribution">*</sup></span></strong>, Eric Cai<sup aria-label="equal contribution">*</sup>, Shobhit Aggarwal, Jianjun Wang, David Held</p>
      <p class="pub-venue"><strong><a href="https://2026.ieee-icra.org/">ICRA, 2026</a></strong></p>
      <p class="pub-abstract">A hierarchical object-centric point diffusion framework that combines dense GMM global initialization with disentangled geometry and frame diffusion to deliver SOTA precision, multi-modal coverage, and generalization in both rigid and non-rigid placement tasks.</p>
      <div class="pub-links">
        <a href="https://arxiv.org/abs/2604.11793">Paper</a>
        <a href="https://3dgp-icra2026.github.io/">Website</a>
        <a href="https://github.com/lyuxinghe/TAX-DPD">Code</a>
      </div>
    </div>
  </article>
</div>

<div class="pub-list">
  <article class="pub-card">
    <div class="pub-media">
      <img src="{{ 'img/publications/GIReplay.jpg' | relative_url }}" alt="GIReplay">
    </div>
    <div class="pub-body">
      <h3 class="pub-title">Enabling Intelligent Procedures: Endoscopy Dataset Collection Trends and Pipeline</h3>
      <p class="pub-authors"><strong><span class="highlight-accent">Lyuxing He</span></strong>, Huxin Gao, Hongliang Ren</p>
      <p class="pub-venue"><strong><a href="https://www.sciencedirect.com/book/9780443132711/handbook-of-robotic-surgery">Handbook of Robotic Surgery, 2024</a></strong></p>
      <p class="pub-abstract">An end-to-end surgical data automation and scene-reconstruction pipeline that assembles an in-vivo GI dataset and trains a pose-free NeRF to deliver dense 3D representations despite specular surfaces and limited data.</p>
      <div class="pub-links">
        <a href="https://www.sciencedirect.com/science/article/abs/pii/B9780443132711000522">Paper</a>
        <a href="https://github.com/lyuxinghe/GI_Replay">Code</a>
      </div>
    </div>
  </article>
</div>
