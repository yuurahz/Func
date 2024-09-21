const cheerio = require('cheerio'),
 fetch = require('node-fetch'),
 axios = require('axios'),
 qs = require('qs'),
 fs = require('fs'),
 _url = require('url'),
 chalk = require('chalk'),
 { fromBuffer, fileTypeFromBuffer } = require('file-type'),
 request = require('request'),
 Jimp = require("jimp"),
 { JSDOM } = require('jsdom'),
 FormData = require("form-data"),
 form = new FormData(),
 gis = require("g-i-s")

module.exports = class Scraper {
   
   twitStalk = async (username) => {
   return new Promise(async (resolve, reject) => {
   axios.get("https://instalker.org/" + username).then(({
      data
    }) => {
      let $ = cheerio.load(data),
        tweets = []
      $("div.activity-posts").each(function(a, b) {
        tweets.push({
          author: {
            username: $(b).find("div.user-text3 > h4 > span").text(),
            nickname: $(b).find("div.user-text3 > h4").text().split("@")[0] || $(b).find("div.user-text3 > h4").text().trim(),
            profile_pic: $(b).find("img").attr("src") || $(b).find("img").attr("onerror"),
            upload_at: $(b).find("div.user-text3 > span").text()
          },
          title: $(b).find("div.activity-descp > p").text() || "",
          media: $(b).find("div.activity-descp > div > a").attr("href") || $(b).find("div.activity-descp > p > video").attr("src") || $(b).find("div.activity-descp > div > a > img").attr("src") || $(b).find("div.activity-descp > div > a > video").attr("src") || "No Media Upload",
          retweet: $(b).find("div.like-comment-view > div > a:nth-child(1) > span").text().replace("Download Image", ""),
          likes: $(b).find("div.like-comment-view > div > a:nth-child(2) > span").text()
        })
      })
      let hasil = {
        username: $("body > main > div.dash-dts > div > div > div:nth-child(1) > div > div > h3 > span").text(),
        nickname: $("body > main > div.dash-dts > div > div > div:nth-child(1) > div > div > h3").text().split("@")[0] || $("body > main > div.dash-dts > div > div > div:nth-child(1) > div > div > h3").text(),
        background: $("body > main > div.dash-todo-thumbnail-area1 > div.todo-thumb1.dash-bg-image1.dash-bg-overlay").attr("style").split("url(")[1].split(")")[0],
        profile: $("body > main > div.dash-todo-thumbnail-area1 > div.dash-todo-header1 > div > div > div > div > div > a > img").attr("src") || $("body > main > div.dash-todo-thumbnail-area1 > div.dash-todo-header1 > div > div > div > div > div > a").attr("href"),
        desc_text: $("body > main > div.dash-dts > div > div > div:nth-child(1) > div > div > span:nth-child(2)").text() || "",
        join_at: $("body > main > div.dash-dts > div > div > div:nth-child(1) > div > div > span:nth-child(3)").text() || $("body > main > div.dash-dts > div > div > div:nth-child(1) > div > div > span:nth-child(5)").text(),
        map: $("body > main > div.dash-dts > div > div > div:nth-child(1) > div > div > span:nth-child(4)").text() || "",
        tweets_count: $("body > main > div.dash-dts > div > div > div:nth-child(2) > ul > li:nth-child(1) > div > div.dscun-numbr").text(),
        followers: $("body > main > div.dash-dts > div > div > div:nth-child(2) > ul > li:nth-child(2) > div > div.dscun-numbr").text(),
        following: $("body > main > div.dash-dts > div > div > div:nth-child(2) > ul > li:nth-child(3) > div > div.dscun-numbr").text(),
        media_count: tweets.length,
        media: tweets || "No Media Upload"
      }
      resolve(hasil)
    })
    })
   }
  
   teleStick = async (url) => {
   return new Promise(async (resolve, reject) => {
      try {
         let packname = url.replace('https://t.me/addstickers/', '')
         let json = await (await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packname)}`, {
            headers: {
               'User-Agent': 'GoogleBot'
            }
         })).data
         let data = []
         let id = json.result.stickers.map(v => v.thumb.file_id)
         for (let i = 0; i < id.length; i++) {
            let path = await (await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${id[i]}`)).data
            data.push({
               url: 'https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/' + path.result.file_path
            })
         }
         resolve({ status: true, data })
      } catch (e) {
         console.error(e)
         return resolve({ status: false })
      }
   })
  }

  KodePos = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://nomorkodepos.com/?s=' + query);
      const $ = cheerio.load(data);
      let _data = []

      $('table.pure-table.pure-table-horizontal > tbody > tr').each((i, u) => {
        let _doto = [];
        $(u).find('td').each((l, p) => {
          _doto.push($(p).text().trim())
        })
        _data.push({
          province: _doto[0],
          city: _doto[1],
          subdistrict: _doto[2],
          village: _doto[3],
          postalcode: _doto[4]
        })
      })
      resolve(_data)
    } catch (err) {
      console.error(err)
    }
    })
  }

  XPanas = async (search = 'indonesia') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('http://164.68.127.15/?id=' + search)
      const $ = cheerio.load(data)
      const ajg = []
      $('#content > .mozaique.thumbs-5 > center > .thumb-block > .thumb-inside > .thumb > a').each((i, u) => {
        ajg.push({
          nonton: 'https://164.68.127.15' + $(u).attr('href'),
          img: $(u).find('img').attr('data-src'),
          title: $(u).find('img').attr('title')
        })
      })
      if (ajg.every(x => x === undefined)) return resolve({ developer: creator, mess: 'no result found' })
      resolve(ajg)
    } catch (err) {
      console.error(err)
     }
    })
  }

  TixID = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.tix.id/tix-now/')
      const $ = cheerio.load(data)
      const hasil = []
      $('div.gt-blog-list > .gt-item').each((i, u) => {
        hasil.push({
          link: $(u).find('.gt-image > a').attr('href'),
          image: $(u).find('.gt-image > a > img').attr('data-src'),
          judul: $(u).find('.gt-title > a').text(),
          tanggal: $(u).find('.gt-details > ul > .gt-date > span').text(),
          deskripsi: $(u).find('.gt-excerpt > p').text(),
        })
      })
      resolve(hasil)
    } catch (err) {
      console.error(err)
    }
   })
  }
   
  AcaraNow = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.jadwaltv.net/channel/acara-tv-nasional-saat-ini');
      const $ = cheerio.load(data)
      let tv = []
      $('table.table.table-bordered > tbody > tr').each((u, i) => {
        let an = $(i).text().split('WIB')
        if (an[0] === 'JamAcara') return
        if (typeof an[1] === 'undefined') return tv.push('\n' + '*' + an[0] + '*')
        tv.push(`${an[0]} - ${an[1]}`)
      })
      if (tv.every(x => x === undefined)) return resolve({ developer: creator, mess: 'no result found' })
      resolve(tv)
    } catch (err) {
      console.error(err)
    }
   })
  }
  
  Jadwalbola = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.jadwaltv.net/jadwal-sepakbola');
      const $ = cheerio.load(data)
      let tv = []
      $('table.table.table-bordered > tbody > tr.jklIv').each((u, i) => {
        let an = $(i).html().replace(/<td>/g, '').replace(/<\/td>/g, ' - ')
        tv.push(`${an.substring(0, an.length - 3)}`)
      })
      if (tv.every(x => x === undefined)) return resolve({ developer: creator, mess: 'no result found' })
      resolve(tv)
    } catch (err) {
      console.error(err)
      }
   })
  }
  
  JadwalTV = async (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.jadwaltv.net/channel/' + query);
      const $ = cheerio.load(data);
      const tv = []
      $('table.table.table-bordered > tbody > tr.jklIv').each((u, i) => {
        let an = $(i).text().split('WIB')
        tv.push(`${an[0]} - ${an[1]}`)
      })
      if (tv.every(x => x === undefined)) return resolve({ developer: creator, mess: 'no result found' })
      resolve(tv.join('\n'))
    } catch (err) {
      console.error(err)
    }
    })
   }
   
  Steam = async (search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.get('https://store.steampowered.com/search/?term=' + search)
      const $ = cheerio.load(data)
      const hasil = []
      $('#search_resultsRows > a').each((a, b) => {
        const link = $(b).attr('href')
        const judul = $(b).find(`div.responsive_search_name_combined > div.col.search_name.ellipsis > span`).text()
        const harga = $(b).find(`div.responsive_search_name_combined > div.col.search_price_discount_combined.responsive_secondrow > div.col.search_price.responsive_secondrow `).text().replace(/ /g, '').replace(/\n/g, '')
        var rating = $(b).find(`div.responsive_search_name_combined > div.col.search_reviewscore.responsive_secondrow > span`).attr('data-tooltip-html')
        const img = $(b).find(`div.col.search_capsule > img`).attr('src')
        const rilis = $(b).find(`div.responsive_search_name_combined > div.col.search_released.responsive_secondrow`).text()

        if (typeof rating === 'undefined') {
          var rating = 'no ratings'
        }
        if (rating.split('<br>')) {
          let hhh = rating.split('<br>')
          var rating = `${hhh[0]} ${hhh[1]}`
        }
        hasil.push({
          judul: judul,
          img: img,
          link: link,
          rilis: rilis,
          harga: harga ? harga : 'no price',
          rating: rating
        })
      })
      if (hasil.every(x => x === undefined)) return resolve({ developer: creator, mess: 'no result found' })
      resolve(hasil)
    } catch (err) {
      console.error(err)
     }
   })
  }
  
  Steam_Detail = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.get(url)
      const $ = cheerio.load(data)
      const xorizn = []
      const img = $('#gameHeaderImageCtn > img').attr('src')
      $('div.game_area_sys_req.sysreq_content.active > div > ul > ul > li').each((u, i) => { xorizn.push($(i).text()) })
      const hasil = $('#genresAndManufacturer').html().replace(/\n/g, '').replace(/<br>/g, '\n').replace(/\t/g, '').replace(/<b>/g, '').replace(/<\/div>/g, '\n').replace(/ /g, '').replace(/<\/b>/g, ' ').replace(/<[^>]*>/g, '')
      const desc = $('div.game_description_snippet').text().replace(/\t/g, '').replace(/\n/g, '')
      const hasill = {
        desc: desc ? desc : 'Error',
        img: img ? img : 'https://i.ibb.co/G7CrCwN/404.png',
        system: xorizn.join('\n') ? xorizn.join('\n') : 'Error',
        info: hasil
      }
      resolve(hasill)
    } catch (err) {
      console.error(err)
     }
   })
  }

  tiktokStalk = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await fetch(`https://tiktok.com/@${user}`, {
        headers: {
          'User-Agent': 'PostmanRuntime/7.32.2'
        }
      })
      const html = await url.text()
      const $ = cheerio.load(html)
      const data = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text()
      const result = JSON.parse(data)
      if (result['__DEFAULT_SCOPE__']['webapp.user-detail'].statusCode !== 0) {
        const ress = {
          status: 'error',
          message: 'User not found!',
        };
        console.log(ress)
        resolve(ress)
      }
      const res = result['__DEFAULT_SCOPE__']['webapp.user-detail']['userInfo']
      resolve(res)
    } catch (err) {
      console.log(err)
      reject(String(err))
    }
  })
  }

  igStory = (username) => {
  return new Promise((resolve, reject) => {
    axios(`https://igs.sf-converter.com/api/profile/${username}`, {
      method: "GET",
      headers: {
        "accept": "*/*",
        "origin": "https://id.savefrom.net",
        "referer": "https://id.savefrom.net/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
      }
    }).then(({ data }) => {
      let id = data.result.id;
      axios(`https://igs.sf-converter.com/api/stories/${id}`, {
        method: "GET",
        headers: {
          "accept": "*/*",
          "origin": "https://id.savefrom.net",
          "referer": "https://id.savefrom.net/",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
        }
      }).then(({ data }) => {
        let result = [];
        data.result.forEach((obj) => {
          let image_url, video_url;
          obj?.image_versions2?.candidates?.forEach((candidate) => {
            if (candidate.width === 1080) {
              image_url = candidate.url;
            }
          });
          obj?.video_versions?.forEach((video) => {
            if (video.type === 101) {
              video_url = video.url;
            }
          });
          let fileType = obj.video ? 'mp4' : 'jpg';
          let newObject = {
            "type": fileType,
            "url": obj.video ? video_url : image_url
          }
          result.push(newObject)
        })

        let responseData = {
          "creator": creator,
          "status": true,
          "data": result
        }

        resolve(responseData)
      }).catch(reject)
    }).catch(reject)
  })
 }

   snackvid = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.post("https://getsnackvideo.com/results", new URLSearchParams({ id: url }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
            })
            const $ = cheerio.load(data)
            const result = {
                status: 200,
                creator: creator,
                thumbnail: $('.img_thumb img').attr('src'),
                no_wm: $('a.download_link.without_watermark').attr('href')
            }
            console.log(result)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
 }

    remini = async (urlPath, method) => {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject()
				let data = []
				res
					.on("data", function (chunk, resp) {
						data.push(chunk)
					})
					.on("end", () => {
						resolve(Buffer.concat(data))
					})
				res.on("error", (e) => {
					reject();
				})
			}
		)
	})
 }

  uploadPomf2 = async (media) => {
  return new Promise(async (resolve, reject) => {
    const formData = new FormData()
    formData.append('files[]', media, { 
      filename: new Date() * 1 + '.jpg' 
    });
    await axios.post('https://pomf2.lain.la/upload.php', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      resolve(e?.response)
    })
  })
 }

  uploader = async (buffer) => {
    return new Promise(async (resolve) => {
      try {
        const { ext } = await fromBuffer(buffer)
        const form = new FormData()
        form.append('file', buffer, 'tmp.' + ext)
        const json = await (await axios.post("https://tmpfiles.org/api/v1/upload", form, {
          headers: {
            "accept": "*/*",
            "accept-language": "id-ID , id; q=O. 9 , en- US ; q=0.8, en q=0.7",
            "content-type": "multipart/form-data",
            "origin": "https://tmpfiles.orgi",
            "referer": "https://tmpfiles.org/",
            "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "Android",
            "sec-fetch-dest": "empty",
            "sec-fetch-mcde": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
            ...form.getHeaders()
          }
        })).data
        if (json.status != 'success') return resolve({
          developer: creator,
          status: false,
          msg: 'Failed to uploaded'
        })
        resolve({
          developer: creator,
          status: true,
          data: {
            url: json.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/')
          }
        })
      } catch (e) {
        console.log(e)
        resolve({
          developer: creator,
          status: false,
          msg: e.message
        })
      }
    })
  }
  
   uploadImage = async (str) => {
    return new Promise(async resolve => {
      try {
        const parse = await (await axios.get('https://imgbb.com', {
          headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36"
          }
        }))
        const token = parse.data.match(/PF\.obj\.config\.auth_token="([^"]*)/)[1]
        const cookie = parse.headers['set-cookie'].join(', ')
        const file = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
          responseType: 'arraybuffer'
        })).data : str
        const { ext } = await fromBuffer(Buffer.from(file))
        let form = new FormData
        form.append('source', Buffer.from(file), 'image.' + ext)
        form.append('type', 'file')
        form.append('action', 'upload')
        form.append('timestamp', (new Date() * 1))
        form.append('auth_token', token)
        const json = await (await axios.post('https://imgbb.com/json', form, {
          headers: {
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
            "Origin": "https://imgbb.com",
            "Referer": "https://imgbb.com/upload",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            cookie,
            ...form.getHeaders()
          }
        })).data
        if (json.status_code != 200) return resolve({
          developer: creator,
          status: false,
          msg: `Failed to Upload!`
        })
        resolve({
          developer: creator,
          status: true,
          original: json,
          data: {
            url: json.image.display_url
          }
        })
      } catch (e) {
        console.log(e)
        resolve({
          developer: creator,
          status: false,
          msg: e.message
        })
      }
    })
   }
  
  uploaderV2 = async (input) => {
    return new Promise(async resolve => {
      try {
        const image = Buffer.isBuffer(input) ? input : input.startsWith('http') ? await (await axios.get(input, {
          responseType: 'arraybuffer'
        })).data : input
        let form = new FormData
        form.append('source', Buffer.from(image), 'image.jpg')
        form.append('type', 'file')
        form.append('action', 'upload')
        form.append('timestamp', (new Date() * 1))
        form.append('auth_token', '3b0ead89f86c3bd199478b2e14afd7123d97507f')
        form.append('nsfw', 0)
        const json = await (await axios.post('https://freeimage.host/json', form, {
          headers: {
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
            "Origin": "https://freeimage.host",
            "Referer": "https://freeimage.host/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-platform": "Android",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            ...form.getHeaders()
          }
        })).data
        if (json.status_code != 200) return resolve({
          creator: creator,
          status: false,
          msg: `Failed to Upload!`
        })
        resolve({
          creator: creator,
          status: true,
          original: json,
          data: {
            url: json.image.url
          }
        })
      } catch (e) {
        console.log(e)
        resolve({
          creator: creator,
          status: false,
          msg: e.message
        })
      }
    })
  }
  
  tt = async (query) => {
    return new Promise(async (resolve, reject) => {
      try {
        const encodedParams = new URLSearchParams()
        encodedParams.set("url", query)
        encodedParams.set("hd", "1")

        const response = await axios({
          method: "POST",
          url: "https://tikwm.com/api/",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: "current_language=en",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
          data: encodedParams,
        })
        const videos = response.data
        resolve(videos)
      } catch (error) {
        reject(error)
      }
    })
  }
  
  ttSearch = async (query) => {
		return new Promise(async (resolve, reject) => {
			axios("https://tikwm.com/api/feed/search", {
				headers: {
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					cookie: "current_language=en",
					"User-Agent":
						"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
				},
				data: {
					keywords: query,
					count: 12,
					cursor: 0,
					web: 1,
					hd: 1,
				},
				method: "POST",
			}).then((res) => {
				resolve(res.data.data)
			})
		})
	}
    
   cariresep = async (query) => {
    return new Promise(async (resolve, reject) => {
        axios.get('https://resepkoki.id/?s=' + query).then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const link = []
                const judul = []
                const upload_date = []
                const format = []
                const thumb = []
                $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function(a, b) {
                    link.push($(b).attr('href'))
                })
                $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function(c, d) {
                    let jud = $(d).text()
                    judul.push(jud)
                })
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        judul: judul[i],
                        link: link[i]
                    })
                }
                const result = {
                    creator: creator,
                    data: format.filter(v => v.link.startsWith('https://resepkoki.id/resep'))
                }
                resolve(result)
            })
            .catch(reject)
        })
    }
    
    detailresep = async (query) => {
    return new Promise(async (resolve,
        reject) => {
        axios.get(query).then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const abahan = []
                const atakaran = []
                const atahap = []
                $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name').each(function(a, b) {
                    let bh = $(b).text()
                    abahan.push(bh)
                })
                $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount').each(function(c, d) {
                    let uk = $(d).text()
                    atakaran.push(uk)
                })
                $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p').each(function(e, f) {
                    let th = $(f).text()
                    atahap.push(th)
                })
                const judul = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1').text()
                const waktu = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span').text()
                const hasil = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span').text().split(': ')[1]
                const level = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span').text().split(': ')[1]
                const thumb = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img').attr('src')
                let tbahan = 'bahan\n'
                for (let i = 0; i < abahan.length; i++) {
                    tbahan += abahan[i] + ' ' + atakaran[i] + '\n'
                }
                let ttahap = 'tahap\n'
                for (let i = 0; i < atahap.length; i++) {
                    ttahap += atahap[i] + '\n\n'
                }
                const tahap = ttahap
                const bahan = tbahan
                const result = {
                    creator: creator,
                    status: 'Succes',
                    data: {
                        judul: judul,
                        waktu_masak: waktu,
                        hasil: hasil,
                        tingkat_kesulitan: level,
                        thumb: thumb,
                        bahan: bahan.split('bahan\n')[1],
                        langkah_langkah: tahap.split('tahap\n')[1]
                    }
                }
                resolve(result)
            })
            .catch(reject)
    })
    }
    
  igdl = async (url) => {
  return new Promise(async (resolve, reject) => {
    const payload = new URLSearchParams(
      Object.entries({
        url: url,
        host: "instagram",
      }),
    )
    await axios
      .request({
        method: "POST",
        baseURL: "https://saveinsta.io/core/ajax.php",
        data: payload,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          cookie: "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      })
      .then((response) => {
        const $ = cheerio.load(response.data)
        const mediaURL = $(
          "div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom",
        )
          .map((_, el) => {
            return (
              "https://saveinsta.io/" +
              $(el).find("div.col-md-8.mx-auto > a").attr("href")
            )
          })
          .get()
        const res = {
          status: 200,
          media: mediaURL,
        }
        resolve(res)
      })
      .catch((e) => {
        console.log(e)
        throw {
          status: 400,
          message: "error",
        }
      })
  })
 }

  fb = async(t) => {
  return new Promise(async (e, a) => {
    const i = await fetch("https://www.getfvid.com/downloader", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.getfvid.com/",
        },
        body: new URLSearchParams(
          Object.entries({
            url: t,
          }),
        ),
      }),
      o = cheerio.load(await i.text())
    e({
      result: {
        url: t,
        title: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a",
        ).text(),
        time: o("#time").text(),
        hd: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a",
        ).attr("href"),
        sd: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a",
        ).attr("href"),
        audio: o(
          "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(3) > a",
        ).attr("href"),
      },
    })
  })
  }

  FacebookDl = async (url) => {
  return new Promise(async(resolve, reject) => {
     try { 
       const config = { 
         'id': url, 
         'locale': 'id' 
       } 
       const { data, status } = await axios('https://getmyfb.com/process', { 
         method: 'POST', 
         data: new URLSearchParams(Object.entries(config)), 
         headers: { 
           "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36", 
           "cookie": "PHPSESSID=914a5et39uur28e84t9env0378; popCookie=1; prefetchAd_4301805=true" 
         } 
       }) 
       if (status === 200) { 
         const $ = cheerio.load(data) 
         const thumb = $('div.container > div.results-item > div.results-item-image-wrapper').find('img').attr('src') 
         const desc = $('div.container > div.results-item > div.results-item-text').text().trim() 
         const video_hd = $('div.container > div.results-download > ul > li:nth-child(1) > a').attr('href') 
         const video_sd = $('div.container > div.results-download > ul > li:nth-child(2) > a').attr('href') 
         const hasil = { 
           desc: desc, 
           thumb: thumb, 
           video_sd: video_sd, 
           video_hd: video_hd 
         } 
         resolve(hasil) 
       } else { 
         console.log('No result found') 
       } 
     } catch (error) { 
       console.error(error) 
     } 
   }) 
  }

  ssweb = (url, device = 'desktop') => {
     return new Promise((resolve, reject) => {
          const base = 'https://www.screenshotmachine.com'
          const param = {
            url: url,
            device: device,
            cacheLimit: 0
          }
          axios({url: base + '/capture.php',
               method: 'POST',
               data: new URLSearchParams(Object.entries(param)),
               headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
               }
          }).then((data) => {
               const cookies = data.headers['set-cookie']
               if (data.data.status == 'success') {
                    axios.get(base + '/' + data.data.link, {
                         headers: {
                              'cookie': cookies.join('')
                         },
                         responseType: 'arraybuffer'
                    }).then(({ data }) => {
                       let result = {
                            status: 200,
                            author: creator,
                            result: data
                        }
                         resolve(result)
                    })
               } else {
                    reject({ status: 404, author: creator, message: data.data })
               }
          }).catch(reject)
     })
  }

    ringtone = (title) => {
    return new Promise((resolve, reject) => {
        axios.get('https://meloboom.com/en/search/'+title)
        .then((get) => {
            let $ = cheerio.load(get.data)
            let hasil = []
            $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
                hasil.push({ title: $(b).find('h4').text(), source: 'https://meloboom.com/'+$(b).find('a').attr('href'), audio: $(b).find('audio').attr('src') })
            })
            resolve(hasil)
        })
    })
  }

    styletext = (teks) => {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('table > tbody > tr').each(function (a, b) {
                hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
            })
            resolve(hasil)
        })
    })
  }

    pinterest = (query) => {
	return new Promise((resolve, reject) => {
	  let err = { status: 404, message: "Terjadi kesalahan" }
	  gis({ searchTerm: query + ' site:id.pinterest.com', }, (er, res) => {
	   if (er) return err
	   let hasil = {
		  status: 200,
		  creator: creator,
		  result: []
	   }
	   res.forEach(x => hasil.result.push(x.url))
	   resolve(hasil)
	  })
	})
   }

    threads = async (username, type) =>{
    return new Promise(async (resolve) => {
         try {
            if (type == 'search') { // search on post or search
            let response = await (await axios.post('https://www.threads.net/api/graphql', {
                lsd: "AVrTctk8rlk",
            variables: JSON.stringify({ 
                query: username, first: 20, should_fetch_ig_inactive_on_text_app: null, __relay_internal__pv__BarcelonaIsLoggedInrelayprovider: null     }),
                doc_id: "7156716761073591",
             },
             { headers: {
            Authority: "www.threads.net",
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://www.threads.net",
            Pragma: "no-cache",
            "Sec-Fetch-Site": "same-origin",
            "X-ASBD-ID": "129477",
            "X-IG-App-ID": "238260118697367",
            "X-FB-LSD": "AVrTctk8rlk",
            "X-FB-Friendly-Name": "BarcelonaProfileThreadsTabQuery",
            }})).data
            if (!response.data.xdt_api__v1__users__search_connection.edges.length) return resolve({
               creator: creator,
               status: false,
               msg: 'User not available'
            })
            let data = []
            response.data.xdt_api__v1__users__search_connection.edges.map(ul => {
               data.push(ul.node)
            })
            resolve({
               creator: creator,
               status: true,
               data
            })
            } else {
            let response = await axios.get(`https://www.threads.net/@${username}`, { headers: {
            Authority: "www.threads.net",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://www.threads.net",
            Pragma: "no-cache",
            Referer: "https://www.instagram.com",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
            }})
            let userIdKeyValue = response.data.match('"user_id":"(\\d+)"')
            let userId = Number(userIdKeyValue[1])
            if (!userId) return resolve({
               creator: creator,
               status: false,
               msg: 'Cant get user id'
            })
            const json = await axios.post('https://www.threads.net/api/graphql', {
            lsd: "AVrTctk8rlk",
            variables: JSON.stringify({ userID: userId }),
            doc_id: "6232751443445612",
            }, { headers: {
            Authority: "www.threads.net",
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://www.threads.net",
            Pragma: "no-cache",
            "Sec-Fetch-Site": "same-origin",
            "X-ASBD-ID": "129477",
            "X-IG-App-ID": "238260118697367",
            "X-FB-LSD": "AVrTctk8rlk",
            "X-FB-Friendly-Name": "BarcelonaProfileThreadsTabQuery",
             }})
             if (!json.data.data.mediaData.threads.length) return resolve({
               creator: creator,
               status: false,
               msg: 'Error no content post'
            })
            let data = []
            json.data.data.mediaData.threads.map(v => 
               data.push(v.thread_items)
            )
             resolve({
               creator: creator,
               status: true,
               data
            })
          }
         } catch (e) {
            console.log(e)
            return resolve({
               creator: creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

    hoax = () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://turnbackhoax.id/`).then(tod => {
            const $ = cheerio.load(tod.data)
            let hasil = []
            $("figure.mh-loop-thumb").each(function(a, b) {
                $("div.mh-loop-content.mh-clearfix").each(function(c, d) {
                    let link = $(d).find("h3.entry-title.mh-loop-title > a").attr('href')
                    let img = $(b).find("img.attachment-mh-magazine-lite-medium.size-mh-magazine-lite-medium.wp-post-image").attr('src')
                    let title = $(d).find("h3.entry-title.mh-loop-title > a").text().trim()
                    let desc = $(d).find("div.mh-excerpt > p").text().trim()
                    let date = $(d).find("span.mh-meta-date.updated").text().trim()
                    const Data = {
                        title: title,
                        thumbnail: img,
                        desc: desc,
                        date: date,
                        link: link
                    }
                    hasil.push(Data)
                })
            })
            resolve(hasil)
        }).catch(reject)
    })
  }

    stickersearch = (query) => {
	return new Promise((resolve) => {
		axios.get(`https://getstickerpack.com/stickers?query=${query}`)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const link = []
				$('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				rand = link[Math.floor(Math.random() * link.length)]
				axios.get(rand)
					.then(({
						data
					}) => {
						const $$ = cheerio.load(data)
						const url = []
						$$('#stickerPack > div > div.row > div > img').each(function(a, b) {
							url.push($$(b).attr('src').split('&d=')[0])
						})
						resolve({
							creator: creator,
							title: $$('#intro > div > div > h1').text(),
							author: $$('#intro > div > div > h5 > a').text(),
							author_link: $$('#intro > div > div > h5 > a').attr('href'),
							sticker: url
						})
					})
			})
	})
  }

   HeroML = async (querry) => {
   return new Promise(async (resolve, reject) => { 
     try { 
       let upper = querry.charAt(0).toUpperCase() + querry.slice(1).toLowerCase() 
       const { data, status } = await axios.get('https://mobile-legends.fandom.com/wiki/' + upper) 
       if (status === 200) { 
         const $ = cheerio.load(data) 
         let atributes = [] 
         let rill = [] 
         let rull = [] 
         let rell = [] 
         let hero_img = $('figure.pi-item.pi-image > a > img').attr('src') 
         let desc = $('div.mw-parser-output > p:nth-child(6)').text() 
         $('.mw-parser-output > table:nth-child(9) > tbody > tr').each((u, i) => { 
           let _doto = [] 
           $(i).find('td').each((o, p) => { _doto.push($(p).text().trim()) }) 
           if (_doto.length === 0) return 
           atributes.push({ 
             attribute: _doto[0], 
             level_1: _doto[1], 
             level_15: _doto[2], 
             growth: _doto.pop() 
           }) 
         }) 
         $('div.pi-item.pi-data.pi-item-spacing.pi-border-color > div.pi-data-value.pi-font').each((i, u) => { rill.push($(u).text().trim()) }) 
         $('aside.portable-infobox.pi-background.pi-border-color.pi-theme-wikia.pi-layout-default').each((i, u) => { rull.push($(u).html()) }) 
         const _$ = cheerio.load(rull[1]) 
         _$('.pi-item.pi-data.pi-item-spacing.pi-border-color').each((l, m) => { 
           rell.push(_$(m).text().trim().replace(/\n/g, ':').replace(/\t/g, '')) 
         }) 
         const result = rell.reduce((acc, curr) => { 
           const [key, value] = curr.split('::') 
           acc[key] = value 
           return acc 
         }, {}) 
         let anu = { 
           hero_img: hero_img, 
           desc: desc, 
           release: rill[0], 
           role: rill[1], 
           specialty: rill[2], 
           lane: rill[3], 
           price: rill[4], 
           gameplay_info: { 
             durability: rill[5], 
             offense: rill[6], 
             control_effect: rill[7], 
             difficulty: rill[8], 
           }, 
           story_info_list: result, 
           story_info_array: rell, 
           attributes: atributes 
         } 
         resolve(anu) 
       } else if (status === 400) { 
         resolve({ mess: 'hh'}) 
       } 
       console.log(status) 
     } catch (err) { 
       resolve({ mess: 'asu'}) 
     } 
   }) 
}

  gore = () => {
  return new Promise((resolve, reject) => {
    const page = Math.floor(Math.random() * 228)
    axios.get("https://seegore.com/gore/page/" + page).then((res) => {
      const $ = cheerio.load(res.data)
      const link = []
      $("ul > li > article").each(function (a, b) {
        link.push({
          title: $(b).find("div.content > header > h2").text(),
          link: $(b).find("div.post-thumbnail > a").attr("href"),
          thumb: $(b).find("div.post-thumbnail > a > div > img").attr("src"),
          view: $(b)
            .find(
              "div.post-thumbnail > div.post-meta.bb-post-meta.post-meta-bg > span.post-meta-item.post-views",
            )
            .text(),
          vote: $(b)
            .find(
              "div.post-thumbnail > div.post-meta.bb-post-meta.post-meta-bg > span.post-meta-item.post-votes",
            )
            .text(),
          tag: $(b)
            .find("div.content > header > div > div.bb-cat-links")
            .text(),
          comment: $(b)
            .find("div.content > header > div > div.post-meta.bb-post-meta > a")
            .text(),
        })
      })
      const random = link[Math.floor(Math.random() * link.length)]
      axios.get(random.link).then((resu) => {
        const $$ = cheerio.load(resu.data)
        const hasel = {}
        hasel.title = random.title
        hasel.source = random.link
        hasel.thumb = random.thumb
        hasel.tag = $$("div.site-main > div > header > div > div > p").text()
        hasel.upload = $$("div.site-main")
          .find("span.auth-posted-on > time:nth-child(2)")
          .text()
        hasel.author = $$("div.site-main")
          .find("span.auth-name.mf-hide > a")
          .text()
        hasel.comment = random.comment
        hasel.vote = random.vote
        hasel.view = $$("div.site-main")
          .find(
            "span.post-meta-item.post-views.s-post-views.size-lg > span.count",
          )
          .text()
        hasel.video1 = $$("div.site-main").find("video > source").attr("src")
        hasel.video2 = $$("div.site-main").find("video > a").attr("href")
        resolve(hasel)
      })
    })
  })
 }

    hentaivid = () => {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 1153)
        axios.get('https://sfmcompile.club/page/'+page)
        .then((data) => {
            const $ = cheerio.load(data.data)
            const hasil = []
            $('#primary > div > div > ul > li > article').each(function (a, b) {
                hasil.push({
                    title: $(b).find('header > h2').text(),
                    link: $(b).find('header > h2 > a').attr('href'),
                    category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
                    share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
                    views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
                    type: $(b).find('source').attr('type') || 'image/jpeg',
                    video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
                    video_2: $(b).find('video > a').attr('href') || ''
                })
            })
            resolve(hasil)
        })
    })
 }


 capcut = async (url) => {
    return new Promise(async (resolve, reject) => {
      axios
        .get("https://ssscap.net/api/download/get-url?url=" + url, {
          headers: {
            cookie:
              "sign=94b3b2331a3515b3a031f161e6ce27a7; device-time=1693144685653",
          },
        })
        .then((res) => {
          let tes = res.data.url;
          const parsedUrl = new URL(tes);
          let id = parsedUrl.searchParams.get("template_id");

          axios("https://ssscap.net/api/download/" + id, {
            headers: {
              cookie:
                "sign=4b0366645cd40cbe10af9aa18331a488; device-time=1693145535913",
            },
          }).then((yanz) => {
            resolve(yanz.data);
          });
        });
    });
  };

    Likee = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.request("https://likeedownloader.com/process", {
                method: "POST",
                data: new URLSearchParams(Object.entries({ id: url })),
                headers: {
                    "cookie": "_ga=GA1.2.553951407.1656223884; _gid=GA1.2.1157362698.1656223884; __gads=ID=0fc4d44a6b01b1bc-22880a0efed2008c:T=1656223884:RT=1656223884:S=ALNI_MYp2ZXD2vQmWnXc2WprkU_p6ynfug; __gpi=UID=0000069517bf965e:T=1656223884:RT=1656223884:S=ALNI_Map47wQbMbbf7TaZLm3TvZ1eI3hZw; PHPSESSID=e3oenugljjabut9egf1gsji7re; _gat_UA-3524196-10=1",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                },
            })
            const $ = cheerio.load(data.template)
            const result = {
                status: 200,
                title: $('div.quote-box p.infotext').text().trim(),
                thumbnail: $('div.quote-box div.img_thumb img').attr('src'),
                watermark: $('.result-links-item:first-child a.with_watermark').attr('href'),
                no_watermark: $('.result-links-item:last-child a.without_watermark').attr('href')
            }
            console.log(result)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
 }

    spek = (query) => {
    return new Promise((resolve, reject) => {
    let result = axios.get('https://carisinyal.com/hp/?_sf_s=' + query).then(v => {
        let $ = cheerio.load(v.data)
        let list = $("div.oxy-posts > div.oxy-post")
        let index = []
        list.each((v, i) => {
            let title = $(i).find("a.oxy-post-title").text()
            let harga = $(i).find("div.harga").text()
            let link = $(i).find("a.oxy-post-image").attr('href')
            let res = {
                title: title,
                harga: harga,
                link: link
            }
            index.push(res)
        })
        return index
    })
    resolve(result)
    })
 }

    speklengkap = (link) => {
    return new Promise((resolve, reject) => {
    let result = axios.get(link).then(v => {
        let $ = cheerio.load(v.data)
        let fitur = []
        let spesifikasi = []
        let list = $("div#_dynamic_list-777-114924 > div.ct-div-block")
        list.each((v, i) => {
            let fitur_unggulan = $(i).find("span.ct-span").text()
            fitur.push({
                desc: fitur_unggulan
            })
        })
        let spek = $("div.ct-code-block > div > table.box-info")
        spek.each((v, i) => {
            let name = $(i).find("tr.box-baris > td.kolom-satu").text().trim()
            let fitur = $(i).find("tr.box-baris > td.kolom-dua").text().trim()
            spesifikasi.push({
                name: name,
                fitur: fitur
            })
        })
        let img = $("meta[name='twitter:image']").attr('content')
        return {
            fitur: fitur,
            spek: spesifikasi,
            img: img
        }
    })
    resolve(result)
    })
 }

  tiktok = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = new URLSearchParams({
        'id': url,
        'locale': 'id',
        'tt': 'RFBiZ3Bi'
      })

      const headers = {
        'HX-Request': true,
        'HX-Trigger': '_gcaptcha_pt',
        'HX-Target': 'target',
        'HX-Current-URL': 'https://ssstik.io/id',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://ssstik.io/id'
      }

      const response = await axios.post('https://ssstik.io/abc?url=dl', data, { headers })
      const html = response.data

      const $ = cheerio.load(html)

      const author = $('#avatarAndTextUsual h2').text().trim()
      const title = $('#avatarAndTextUsual p').text().trim()
      const video = $('.result_overlay_buttons a.download_link').attr('href')
      const audio = $('.result_overlay_buttons a.download_link.music').attr('href')
      const imgLinks = []
      $('img[data-splide-lazy]').each((index, element) => {
        const imgLink = $(element).attr('data-splide-lazy')
        imgLinks.push(imgLink) 
      })
      
      const result = {
        author,
        title,
        result: video || imgLinks,
        audio
      }
      resolve(result)
    } catch (error) {
      console.error('Error:', error)
      reject(null)
    }
  })
 }

    wikimedia = (title) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
        .then((res) => {
            let $ = cheerio.load(res.data)
            let hasil = []
            $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
                hasil.push({
                    title: $(b).find('img').attr('alt'),
                    source: $(b).attr('href'),
                    image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
                })
            })
            resolve(hasil)
        })
    })
 }

  Wikipedia = (query) => {
  return new Promise((resolve, reject) => {
    fetch(`https://id.m.wikipedia.org/w/index.php?search=${query}`)
      .then((response) => response.text())
      .then((html) => {
        const $ = cheerio.load(html)

        const contentArray = []
        $("div.mw-parser-output p").each((index, element) => {
          contentArray.push($(element).text().trim())
        })

        const infoTable = []
        $("table.infobox tr").each((index, element) => {
          const label = $(element).find("th.infobox-label").text().trim()
          const value =
            $(element).find("td.infobox-data").text().trim() ||
            $(element).find("td.infobox-data a").text().trim()
          if (label && value) {
            infoTable.push(`${label}: ${value}`)
          }
        })

        const data = {
          author: creator,
          title: $("title").text().trim(),
          content: contentArray.join("\n"),
          image:
            "https:" +
            ($("#mw-content-text img").attr("src") ||
              "//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png"),
          infoTable: infoTable.join("\n"),
        }

        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
 }
  
  soundMeme = () => {
  return new Promise((resolve, reject) => {
    axios.get("https://www.myinstants.com/en/index/id/")
      .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)
        const results = []

        $('.instant').each((index, element) => {
          const title = $(element).find('.instant-link').text().trim()
          const soundLinkRelative = $(element).find('button.small-button').attr('onclick').match(/play\('(.+?)'/)[1]
          const soundLink = 'https://www.myinstants.com' + soundLinkRelative
          const pageLink = 'https://www.myinstants.com' + $(element).find('.instant-link').attr('href')

          results.push({ title, soundLink, pageLink })
        })

        resolve(results)
      })
      .catch((error) => {
        console.error('Error:', error)
        resolve([])
      })
  })
 }

  newSoundMeme = () => {
  return new Promise((resolve, reject) => {
    axios.get("https://www.myinstants.com/en/recent")
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const results = []

        $('.instant').each((index, element) => {
          const title = $(element).find('.instant-link').text().trim()
          const soundLinkRelative = $(element).find('button.small-button').attr('onclick').match(/play\('(.+?)'/)[1]
          const soundLink = 'https://www.myinstants.com' + soundLinkRelative
          const pageLink = 'https://www.myinstants.com' + $(element).find('.instant-link').attr('href')

          results.push({ title, soundLink, pageLink })
        })

        resolve(results)
      })
      .catch(error => {
        console.error('Error:', error)
        reject([])
      })
  })
 }

  searchSound = (query) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.myinstants.com/en/search/?name=${query}`)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const results = []

        $('.instant').each((index, element) => {
          const title = $(element).find('.instant-link').text().trim()
          const soundLinkRelative = $(element).find('button.small-button').attr('onclick').match(/play\('(.+?)'/)[1]
          const soundLink = 'https://www.myinstants.com' + soundLinkRelative;
          const pageLink = 'https://www.myinstants.com' + $(element).find('.instant-link').attr('href')

          results.push({ title, soundLink, pageLink })
        })

        resolve(results)
      })
      .catch(error => {
        console.error('Error:', error)
        resolve([])
      })
  })
 }

  categorySound = (category) => {
  return new Promise((resolve, reject) => {
    const categories = ['games', 'anime manga', 'memes', 'movies', 'music', 'politics', 'pranks', 'reactions', 'sound effects', 'sports', 'television', 'tiktok trends', 'viral', 'whatsapp audios']

    if (!categories.includes(category)) {
      console.error('Invalid category.')
      reject(categories)
    }

    axios.get(`https://www.myinstants.com/en/categories/${category}`)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const results = []

        $('.instant').each((index, element) => {
          const title = $(element).find('.instant-link').text().trim()
          const soundLinkRelative = $(element).find('button.small-button').attr('onclick').match(/play\('(.+?)'/)[1]
          const soundLink = 'https://www.myinstants.com' + soundLinkRelative
          const pageLink = 'https://www.myinstants.com' + $(element).find('.instant-link').attr('href')

          results.push({ title, soundLink, pageLink })
        })

        resolve(results)
      })
      .catch(error => {
        console.error('Error:', error)
        resolve([]);
      })
  })
 }
    
  PlayStore = async (search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`)
      const hasil = []
      const $ = cheerio.load(data)
      $('.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a').each((i, u) => {
        const linkk = $(u).attr('href')
        const nama = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text()
        const developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text()
        const img = $(u).find('.j2FCNc > img').attr('src')
        const rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label')
        const rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text()
        const link = `https://play.google.com${linkk}`

        hasil.push({
          link: link,
          nama: nama ? nama : 'No name',
          developer: developer ? developer : creator,
          img: img ? img : 'https://i.ibb.co/G7CrCwN/404.png',
          rate: rate ? rate : 'No Rate',
          rate2: rate2 ? rate2 : 'No Rate',
          link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(" ").join('+')}`
        })
      })
      if (hasil.every(x => x === undefined)) return resolve({ message: 'Tidak ada result!' })
      resolve(hasil)
    } catch (err) {
      console.error(err)
    }
  })
 }

  BukaLapak = async (search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`https://www.bukalapak.com/products?from=omnisearch&from_keyword_history=false&search[keywords]=${search}&search_source=omnisearch_keyword&source=navbar`, {
        headers: {
          "user-agent": 'Mozilla/ 5.0(Windows NT 10.0; Win64; x64; rv: 108.0) Gecko / 20100101 Firefox / 108.0'
        }
      })
      const $ = cheerio.load(data);
      const dat = [];
      const b = $('a.slide > img').attr('src');
      $('div.bl-flex-item.mb-8').each((i, u) => {
        const a = $(u).find('observer-tracker > div > div');
        const img = $(a).find('div > a > img').attr('src');
        if (typeof img === 'undefined') return

        const link = $(a).find('.bl-thumbnail--slider > div > a').attr('href');
        const title = $(a).find('.bl-product-card__description-name > p > a').text().trim();
        const harga = $(a).find('div.bl-product-card__description-price > p').text().trim();
        const rating = $(a).find('div.bl-product-card__description-rating > p').text().trim();
        const terjual = $(a).find('div.bl-product-card__description-rating-and-sold > p').text().trim();

        const dari = $(a).find('div.bl-product-card__description-store > span:nth-child(1)').text().trim();
        const seller = $(a).find('div.bl-product-card__description-store > span > a').text().trim();
        const link_sel = $(a).find('div.bl-product-card__description-store > span > a').attr('href');

        const res_ = {
          title: title,
          rating: rating ? rating : 'No rating yet',
          terjual: terjual ? terjual : 'Not yet bought',
          harga: harga,
          image: img,
          link: link,
          store: {
            lokasi: dari,
            nama: seller,
            link: link_sel
          }
        };

        dat.push(res_);
      })
      if (dat.every(x => x === undefined)) return resolve({ message: 'Tidak ada result!' })
      resolve(dat)
    } catch (err) {
      console.error(err)
    }
  })
 }
    
    anichinSearch = async (query) => {
	return new Promise(async (resolve, reject) => {
		let res = {
			results_found: 0,
			data: []
		}
		let search = await axios.get("https://anichin.top", {
			params: {
				s: query
			}
		})
		const $ = cheerio.load(search.data)
		$('.listupd .bs').each((index, element) => {
			res.results_found = res.results_found + 1
			let data = {}
			data.title = $(element).find('.bsx a').attr('title')
			data.status = $(element).find('.bt .epx').text()
			data.type = $(element).find('.limit .typez').text()
			data.url = $(element).find('.bsx a').attr('href')
			data.imgUrl = $(element).find('img').attr('src')
			res.data.push(data)
		})
		resolve(res)
		 
	})
  }

    anichinEps = async (url) => {
	return new Promise(async (resolve, reject) => {
		let res = {}
		let get = await axios.get(url)
		const $ = cheerio.load(get.data)
		res.author = Buffer.from("QHJpZnphLnAucA==", "base64").toString("ascii")
		res.title = $('.entry-title').text().trim()
		res.imageUrl = $('.ime img').attr('data-lazy-src').trim()
		res.status = $('span:contains("Status:")').text().replace('Status:', '').trim()
		res.rating = $('.rating strong').text().trim()
		res.dirilis = $('span:contains("Dirilis:")').text().replace('Dirilis:', '').trim()
		res.durasi = $('span:contains("Durasi:")').text().replace('Durasi:', '').trim()
		res.studio = $('span:contains("Studio:") a').text().trim()
		res.network = $('span:contains("Network:") a').text().trim()
		res.negara = $('span:contains("Negara:") a').text().trim()
		res.tipe = $('span:contains("Tipe:")').text().replace('Tipe:', '').trim()
		res.episode = $('span:contains("Episode:")').text().replace('Episode:', '').trim()
		res.fansub = $('span:contains("Fansub:")').text().replace('Fansub:', '').trim()
		res.posted_by = $('span:contains("Diposting oleh:")').text().replace('Diposting oleh:', '').trim()
		res.add = $('span:contains("Ditambahkan:")').text().replace('Ditambahkan:', '').trim()
		res.edited = $('span:contains("Terakhir diedit:")').text().replace('Terakhir diedit:', '').trim()
		let genres = []
		$('.genxed a[rel="tag"]').each((index, element) => {
			genres.push($(element).text().trim())
		})
		res.genres = genres.join(', ')
		res.sinopsis = $('.entry-content p').eq(0).text().trim()
		res.note = $('.entry-content p').eq(1).text().trim()
		const episodes = []

		$('.eplister li').each((index, element) => {

			const episode = {}
			const link = $(element).find('a')
			episode.url = link.attr('href')
			episode.number = link.find('.epl-num').text().trim()
			episode.name = link.find('.epl-title').text().trim()
			episode.date = link.find('.epl-date').text().trim()

			episodes.push(episode)

		})
	  	res.episodes = episodes
	  			
		resolve(res)
	})
 }

  videy = async (link) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(link, {
        method: 'GET',
        headers: {
          'User-Agent': 'GoogleBot'
        }
      })
      if (!response.ok) {
        reject('Failed to fetch the page')
        return
      }
      let text = await response.text()
      let dom = new JSDOM(text)
      let doc = dom.window.document
      var videoLink = doc.querySelector('div.video video source').getAttribute('src')
      console.log(videoLink)
      resolve({ result: videoLink })
    } catch (error) {
      reject(error)
    }
  })
 }
 
    wallpaper = (title, page = '1') => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('div.grid-item').each(function (a, b) {
                hasil.push({
                    title: $(b).find('div.info > a > h3').text(),
                    type: $(b).find('div.info > a:nth-child(2)').text(),
                    source: 'https://www.besthdwallpaper.com/'+$(b).find('div > a:nth-child(3)').attr('href'),
                    image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
                })
            })
            resolve(hasil)
        })
    })
   }
 }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})