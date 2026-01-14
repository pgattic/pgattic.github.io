+++
title = "The WASM Experiment"
date = 2025-03-03
template = "blog-page.html"
+++

# The WASM Experiment

If WebAssembly is meant to be a fast and memory-efficient bytecode, what are the chances of getting old gaming systems to execute code compiled to it? And would that open up the door for running Rust or Golang on the Nintendo DS?

Just the thought of taking Rust code I wrote and running it on my very own Nintendo DS gives me the chills. In the past I have tried out projects like [MicroLua DS](https://www.gamebrew.org/wiki/Micro_Lua_DS) to make small-scale games for the Nintendo DS, but it just didn't quite satisfy my hunger to make the Nintendo DS run with new technology. I took a look at [cargo-nds](https://github.com/SeleDreams/cargo-nds) and was impressed but saw that it was still missing any substantial tooling or examples. And that was when WebAssembly came to mind.

I did a quick Google search, and came across an intriguing blog post by Martin Moxon, titled [WebAssembly on your Nintendo DS](https://softwayre.com/blog/2021/09/13/webassembly-on-your-nintendo-ds). It absolutely blew my mind! Martin described compiling [WASM3](https://github.com/wasm3/wasm3) with the `arm-none-eabi` port of GCC provided by [devkitARM](https://devkitpro.org/wiki/Getting_Started) and linking it into a Nintendo DS project. It was an extremely fun blog post to read, and it inspired me to push that concept further.

## The Experiment

I have no idea how far I can take this project. Before creating the GitHub repository, I accepted the likely possibility that I would hit some impassible barrier and have to stop. Also, I decided to divide my steps cleanly and prepare a clear way forward for myself as long as there is progress being made.

I began with the following steps for myself:

```
- Learn some Docker
- Get Martin Moxon's WASM on NDS project running in a reproducible environment
- Have it run a wasm file compiled from a different language than AssemblyScript
- Have it load a file from file storage instead of embedding it?
    - Also add file picker?
- Port to GBA
- Will require learning a new graphics library for GBA
- Define functions for game engine to expose
```

I also wanted to read up on TIC-80 and PICO-8 to see what design decisions were made and avoided, and follow suit where I saw fit.

## Standardization through Containerization

This isn't my first time trying to write code that runs on the Nintendo DS (that award goes to [this](https://github.com/pgattic/snek)). And I have found it super confusing trying to support all this cross-compilation without cluttering my normal dev environment. However, I have a plan that I think will work. I've decided to learn Docker. I know, I "should have used Nix". But I chose Docker for the same reason I chose C as the language to program it in: I want to learn what "just works" for here and now. Nix isn't out of the picture, but it's not a priority.

## Using BlocksDS: A Shot in the Dark

Despite generally sticking to more "time-tested" technologies, I did have a curiosity for the [BlocksDS](https://blocksds.skylyrac.net/docs/) toolchain for Nintendo DS development. I justify its use since it is meant to be mostly a "drop-in" replacement for the older devkitARM toolchain, while promising smaller and more efficient Nintendo DS binaries and some cool additional features. However, that still meant that I would have to trust that it could replace devkitARM in the instructions laid out by Martin Moxon.

Luckily, installing BlocksDS in the Docker container was pretty simple, and their documentation (and the devs themselves on Discord) were extremely helpful. I also had the Dockerfile download and compile wasm3 as part of the build process, so all I had to do was link it in my Makefile.

## Putting it all Together

Now that I have an environment ready, it's time to code! I decided I would not aim for reproducing Martin's WASM on NDS example exactly, since my project is different. But pretty early on, I hit an exciting milestone (using BlocksDS)!

![First WASM function on Nintendo DS! Photo taken Feb. 28th, 2025](/hello-from-ts-wasm.jpg)

This turned my excitement into a flurry of frantic programming, which quickly resulted in a snake game written in TypeScript/AssemblyScript running on my DS:

![TypeScript Snake. Photo taken Mar. 1, 2025](/wasm-snake-ts.jpg)

And later that day, a Rust equivalent!

![Rust Snake. Photo taken Mar. 1, 2025](/wasm-snake-rust.jpg)

In the process of making the Rust rewrite, I also learned a great deal about Rust's `no_std`, and getting around its limitations had me getting really creative, such as by using a ring buffer to store the positions of the snake's body segments.

## Key Takeaways

I feel on top of the world right now! I don't know how easy this is gonna be to explain to my friends, but I am so hyped out! Some things I learned so far:

- Docker
- Managing and linking C libraries
- Using wasm3
- Compiling TypeScript to WASM
- Rust's `no_std`

I am so excited to see where this goes! Every time I sit down to code more, I have so much to do, and it doesn't feel like that's stopping anytime soon! Come back to my blog later to see what else I get done!

(Note from Preston: This article was actually written on August 26th, 2025, as if on March 3rd.)

