import json
import asyncio
import discord
from quart import Quart, render_template, websocket, copy_current_websocket_context

app = Quart(__name__)
client = discord.Client()

with open("config.json", encoding="utf-8") as o:
    config = json.loads(o.read())

feeds = {}


@app.route("/")
async def index():
    return await render_template("index.html")


@app.route("/<int:channel_id>")
async def channel_feed(channel_id):
    return await render_template("feed.html", channel_id=channel_id)


async def receiving():
    while True:
        # We won't be receiving any data so why is this here
        data = await websocket.receive()


@app.websocket("/<int:channel_id>")
async def channel_feed_websocket(channel_id):
    obj = websocket._get_current_object()

    if not channel_id in feeds:
        feeds[channel_id] = set()

    feeds[channel_id].add(obj)

    consumer = asyncio.ensure_future(copy_current_websocket_context(receiving)(),)
    try:
        await asyncio.gather(consumer)
    finally:
        consumer.cancel()
        feeds[channel_id].remove(obj)


@client.event
async def on_ready():
    print(
        f"Bot running: {client.user.name}#{client.user.discriminator} ({client.user.id})"
    )
    await app.run_task()


@client.event
async def on_message(message):
    if not message.channel.id in feeds:
        return

    data = {
        "message": message.clean_content,
        "author": message.author.name,
        "color": str(message.author.color),
    }

    data = json.dumps(data)

    for ws in feeds[message.channel.id]:
        await ws.send(data)


client.run(config["token"])
