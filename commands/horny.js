const axios = require('axios')
const signale = require('signale')

exports.checkRequest = (message) => {
  if (message.content.toLowerCase().charAt(0) === '$' && !message.content.includes('clearchannel')) {
    // Get tags from $command
    let imgLimit = message.content.includes('-5') ? 5 : 1
    let data = message.content.replace('-5', '').replace(' ', '').split('$')
    let tags = data[1].replace(' ', '+')
    let pid = Math.floor((Math.random() * 5000) + 1)

    axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=${imgLimit}&tags=${tags}&pid=${pid}`)
      .then((data) => {
        data.data.forEach(image => {
          if (image !== undefined) {
            let embed = {
              'title': 'Go to image source on Gelbooru',
              'description': tags === '' ? 'No tags.' : `You searched for: ${tags}`,
              'url': `https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`,
              'color': 44678,
              'image': {
                'url': `${image.file_url}`
              }
            }
            message.reply({ embed })
              .then(() => signale.success(`${message.author.username} requested '${message.content}' = ${image.file_url}`))
              .catch(error => signale.fatal(new Error(error)))
          }
        })
      })
      .catch((error) => {
        message.reply('Sorry, there was an unexpected error. Try with another tags')
        signale.fatal(new Error(error))
      })
  }
}

exports.checkHelp = (message) => {
  if (message.content === '$help') {
    let embed =
    {
      title: 'Commands',
      fields: [
        {
          name: '$',
          value: 'Search random images (Can be NSFW)'
        },
        {
          name: '$tag',
          value: 'Search for tag'
        },
        {
          name: '$tag -5',
          value: 'Search for tag and get 5 results at once'
        },
        {
          name: '$tag1 tag2',
          value: 'Search for tag1 and tag2'
        },
        {
          name: '$tag rating:explicit',
          value: 'Search for tag : Explicit content only'
        },
        {
          name: '$tag rating:questionable',
          value: 'Search for tag : Questionable content only'
        },
        {
          name: '$tag rating:safe',
          value: 'Search  for tag : Safe content only'
        }
      ]
    }
    message.reply('', { embed: embed })
      .then(() => signale.success(`${message.author.username} requested ${message.content}`))
      .catch(error => signale.fatal(new Error(error)))
  }
}

exports.clearchannel = (message) => {
  async function clear () {
    message.delete()
    const messages = await message.channel.fetchMessages({ limit: 99 })
    message.channel.bulkDelete(messages)
  }
  if (message.content.toLowerCase().startsWith('$clearchannel')) {
    clear()
  }
}