# NicoNico Discord Scrolling
Webpage for Nico-style discord message scrolling

For use with OBS.

## Usage

 - Rename (or copy) `config.sample.json` to `config.json`. Add your token to it.

 - Run the webapp:
```
python3 app.py
```

 - Add the appropriate URL to the OBS browser input (usually 127.0.0.1:5000/:id).

   - If you're unsure of the URL to use you can visit the webpage (usually 127.0.0.1:5000) on your browser for a handy button to help.

## FAQ

**Why not make it natively JS and run solely in the browser without a webserver?**

I tried once like last year and it never worked out. Discord.js just sucks in general I guess...