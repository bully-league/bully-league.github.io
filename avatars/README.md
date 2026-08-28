# Persona avatars

Square images, ~200x200+, served at `https://bully-league.github.io/avatars/<file>`
and shown as the round profile picture on news posts (Discord embeds + the site).

Expected filenames (referenced from src/discord/leagueNews.ts's PERSONAS):

- `boone.png`   — Coach Herman Boone (coaching/play reactions + GOTW previews)
- `boucher.png` — Bobby "Waterboy" Boucher (player movement)

Tom Brady's avatar hotlinks ESPN's public headshot CDN and needs no file here.
Missing files fail soft: Discord shows no icon, the site falls back to initials.
