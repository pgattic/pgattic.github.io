+++
title = "png-to-2bpp"
date = 2022-08-23
template = "blog-page.html"
+++

Today I worked quite a bit on an NES assembly tool: a png-to-2bpp converter, written in Python! I am not particularly familiar with Python, so I think it has been a good challenge so far!

- As of now it can convert any .png into an NES-compatible .2bpp file, using the brightness of pixels to determine between four different palette color slots, and of course writing that image data in a way the NES can understand.
- This is not necessarily a color depth reducer or color filter. It actually rearranges the graphics data into the NES's two-layered 8x8 tile format. The example shown here is somewhat outside the scope of the project (it was meant for sprite sheets, not whole images), but is still a cool demo.
- This tool may come with my SMB disassembly modernization project, depending on its practicality.

![Tool Screenshot](/png2bpp.png)

*Me in 2-bits-per-pixel!*

