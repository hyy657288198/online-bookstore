const axios = require('axios');

exports.getBooks = async function(req, res) {
    try {
        const { q, filter } = req.body;

        let bookdata = [];
        const url = `https://www.googleapis.com/books/v1/volumes?q=${q}`;

        const apiKey = 'AIzaSyCLSav1pLkJDVrYH4ZsQXxuDPHQpnlw2vs';
        if(filter.length === 0){
            const apiUrl = url + `&maxResults=40&key=${apiKey}`;
            const response = await axios.get(apiUrl);
            bookdata = response.data.items;
        } else {
            if(filter.includes('author')){
                const apiUrl = url + `+inauthor:${q}&maxResults=40&key=${apiKey}`;
                const response = await axios.get(apiUrl);
                bookdata.push(...response.data.items)
            }
            if(filter.includes('title')){
                const apiUrl = url + `+intitle:${q}&maxResults=40&key=${apiKey}`;
                const response = await axios.get(apiUrl);
                bookdata.push(...response.data.items)
            }
            if(filter.includes('field')){
                const apiUrl = url + `+subject:${q}&maxResults=40&key=${apiKey}`;
                const response = await axios.get(apiUrl);
                bookdata.push(...response.data.items)
            }
        }

        const books = bookdata
            .filter(item => item.saleInfo.listPrice)
            .map(item => ({
                key: item.id,
                item: item.volumeInfo.imageLinks?.thumbnail || '',
                name: item.volumeInfo.title || '',
                author: item.volumeInfo.authors || [],
                infoLink: item.volumeInfo.infoLink,
                subtable:{
                    description: item.volumeInfo.description || '',
                    num_of_pages: item.volumeInfo.pageCount || '',
                    publisher: item.volumeInfo.publisher || '',
                    publication_time: item.volumeInfo.publishedDate || '',
                    field: item.volumeInfo.categories || [],
                    price: item.saleInfo.listPrice.amount || ''}
            }));
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};