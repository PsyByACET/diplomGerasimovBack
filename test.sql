create TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    mail VARCHAR(255),
    password VARCHAR(255),
    username VARCHAR(255),
    picture  VARCHAR(255),
    basket INTEGER[],
    buy INTEGER[],
    likes INTEGER[],
    about VARCHAR(255)
);

create TABLE link(
    id SERIAL PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES users (id),
    youtube VARCHAR(255),
    vk VARCHAR(255),
    tg VARCHAR(255),
    twitter VARCHAR(255),
    facebook VARCHAR(255),
    deviant_art VARCHAR(255),
    art_station VARCHAR(255)
);
create TABLE model(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    license  VARCHAR(255),
    link_photo VARCHAR(255),
    id_artist INTEGER,
    FOREIGN KEY (id_artist) REFERENCES users (id),
    description VARCHAR(255),
    categories VARCHAR(255)[],
    formats VARCHAR(255)[],
    tags VARCHAR(255)[],
    price INTEGER,
    like_count INTEGER,
    link_download VARCHAR(255),
    size VARCHAR(255)
);
create TABLE test1(
    id SERIAL PRIMARY KEY,
    tags VARCHAR(255)[10]
);

