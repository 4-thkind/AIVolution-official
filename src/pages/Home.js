import React from 'react';
import { Boot } from '../components/home/Boot';
import { Hero } from '../components/home/Hero';
import { GitLog } from '../components/home/GitLog';
import { About } from '../components/home/About';
import { Departments } from '../components/home/Departments';
import { Events } from '../components/home/Events';
import { Contributors } from '../components/home/Contributors';
import { Sponsors } from '../components/home/Sponsors';
import { Join } from '../components/home/Join';

export const Home = () => (
  <main className="nb">
    <Boot />
    <Hero />
    <GitLog />
    <About />
    <Departments />
    <Events />
    <Contributors />
    <Sponsors />
    <Join />
  </main>
);
