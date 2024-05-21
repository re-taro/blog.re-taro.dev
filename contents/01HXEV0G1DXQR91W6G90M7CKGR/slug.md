---
title: initial
description: A slug to test the rendering of the markdown.
tags: ["markdown", "blog"]
published: true
publishedAt: 2004-04-25T05:52:00.000+09:00[Asia/Tokyo]
updatedAt: 2024-05-22T01:24:36.648+09:00[Asia/Tokyo]
---

# initial

## はじめに

ブログを再構築した。これは、そのテスト用のポストである。

## テスト

以降は、本サイトのマークアップやスタイルをテストするためのセクションである。

対応している記法を列挙し、挙動を確認する。

### heading section 3

ここは `<h3>` セクションである。

#### heading section 4

ここは `<h4>` セクションである。

### テキストの装飾

テキストの装飾は以下の通りである。

- **太字**は `<strong>` を用いて表現する
- *斜体*は `<em>` を用いて表現する
- ~~取り消し線~~は `<del>` を用いて表現する

### 脚注

脚注は `<sup>` を用いて表現する。

これは脚注である[^1]。

[^1]: これは脚注の内容である。

### リスト

リストは 2 つの種類がある。

1. 番号付きリスト
2. 番号なしリスト

それぞれは使うタグが違う

- ここはリスト
- unordered list は `<ul>` を用いて表現する
  - 入れ子も可能
  - ここは入れ子のリスト
- リストの中で引用もできる
  - > 引用は `<blockquote>` を用いて表現する

### 定義リスト

定義リストは、`<dl>` を用いて表現する。

- term 1:
  - details 1
  - details 2
- term 2:
  - details 3

### 引用

引用は `<blockquote>` を用いて表現する。

> これは引用である。
>
> 複数行にまたがる引用も可能である。
>
> --- https://example.com

### テーブル

テーブルは `<table>` を用いて表現する。

| file type | size | ratio |
| :-------- | ---: | ----: |
| .webp     | 9503 |  100% |
| .webp.gz  | 2608 |   28% |
| .webp.br  | 2433 |   27% |

テーブルのデザインは [jxck](https://twitter.com/Jxck_) さんの [テーブルデザイン](https://blog.jxck.io/entries/2022-03-06/markdown-style-table-css.html) を参考にした。

### 画像

画像は `<img>` を用いて表現する。

![my icon](./rintaro.jpg)

### コード

コードは `<code>` を用いて表現する。

```rs:main.rs
use std::net::{SocketAddr, SocketAddrV4};
use std::time::Duration;

use axum::extract::DefaultBodyLimit;
use axum::http::{header, HeaderValue, Method};
use axum::Router;
use cfg_if::cfg_if;
use repaint_server_core::SeaOrm;
use repaint_server_firestore::Firestore;
use repaint_server_gcs::Gcs;
use repaint_server_otp::Otp;
use repaint_server_pubsub::PubSub;
use repaint_server_usecase::usecase::admin::AdminUsecaseImpl;
use repaint_server_usecase::usecase::event::EventUsecaseImpl;
use repaint_server_usecase::usecase::image::ImageUsecaseImpl;
use repaint_server_usecase::usecase::palette::PaletteUsecaseImpl;
use repaint_server_usecase::usecase::spot::SpotUsecaseImpl;
use repaint_server_usecase::usecase::traffic::TrafficUsecaseImpl;
use repaint_server_usecase::usecase::visitor::VisitorUsecaseImpl;
use repaint_server_util::{envvar, envvar_str};
use teloc::{Resolver, ServiceProvider};
use tokio::signal;
use tokio::sync::oneshot;
use tower_http::cors::CorsLayer;
use tracing_subscriber::fmt;

use crate::routes::admin::admin;
use crate::routes::healthz::healthz;
use crate::routes::license::license;
use crate::routes::metrics::metrics;
use crate::routes::version::version;
use crate::routes::visitor::visitor;

mod middleware;
mod routes;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .event_format(fmt::format::json())
        .init();

    let addr: SocketAddr = SocketAddr::V4(SocketAddrV4::new(
        envvar("LISTEN_IP_ADDR", Some([127, 0, 0, 1].into())),
        envvar("PORT", 4000),
    ));
    let db_url = envvar_str("DATABASE_URL", None);
    let db = SeaOrm::new(db_url).await.expect("couldn't connect to db");

    let container = ServiceProvider::new()
        .add_singleton::<SeaOrm>()
        .add_singleton::<FirestoreProvider>()
        .add_singleton::<GcsProvider>()
        .add_singleton::<OtpProvider>()
        .add_singleton::<PubSubProvider>()
        .add_singleton::<EmailProvider>()
        .add_transient::<AdminUsecaseImpl<SeaOrm, FirestoreProvider, EmailProvider>>()
        .add_transient::<EventUsecaseImpl<SeaOrm, FirestoreProvider>>()
        .add_transient::<ImageUsecaseImpl<SeaOrm, GcsProvider, OtpProvider, PubSubProvider>>()
        .add_transient::<PaletteUsecaseImpl<SeaOrm, PubSubProvider>>()
        .add_transient::<SpotUsecaseImpl<SeaOrm, FirestoreProvider, PubSubProvider>>()
        .add_transient::<TrafficUsecaseImpl<SeaOrm, PubSubProvider>>()
        .add_transient::<VisitorUsecaseImpl<SeaOrm, PubSubProvider>>()
        .add_instance(db)
        .add_instance(firestore_provider().await)
        .add_instance(gcs_provider().await)
        .add_instance(otp_provider())
        .add_instance(pubsub_provider().await)
        .add_instance(email_provider());

    let admin_usecase: AdminUsecaseImpl<_, _, _> = container.resolve();
    let event_usecase: EventUsecaseImpl<_, _> = container.resolve();
    let image_usecase: ImageUsecaseImpl<_, _, _, _> = container.resolve();
    let palette_usecase: PaletteUsecaseImpl<_, _> = container.resolve();
    let spot_usecase: SpotUsecaseImpl<_, _, _> = container.resolve();
    let traffic_usecase: TrafficUsecaseImpl<_, _> = container.resolve();
    let visitor_usecase: VisitorUsecaseImpl<_, _> = container.resolve();

    let app = Router::new()
        .nest(
            "/admin",
            admin(
                admin_usecase,
                event_usecase,
                traffic_usecase,
                spot_usecase.clone(),
                image_usecase.clone(),
            ),
        )
        .nest(
            "/visitor",
            visitor(
                visitor_usecase,
                palette_usecase,
                image_usecase,
                spot_usecase,
            ),
        )
        .merge(healthz())
        .merge(version())
        .merge(license())
        .merge(metrics())
        .layer(
            CorsLayer::new()
                .allow_headers(vec![header::CONTENT_TYPE, header::AUTHORIZATION])
                .allow_methods(vec![
                    Method::GET,
                    Method::POST,
                    Method::PATCH,
                    Method::DELETE,
                ])
                .allow_origin(
                    envvar_str("CORS_ALLOW_ORIGIN", "http://localhost:3000")
                        .parse::<HeaderValue>()
                        .expect("invalid CORS_ALLOW_ORIGIN"),
                ),
        )
        .layer(DefaultBodyLimit::max(envvar("BODY_LIMIT", 2 * 1024 * 1024)));

    tracing::info!("staring server at {addr}");

    let (send, recv) = oneshot::channel();

    tokio::select! {
        _ = axum::Server::bind(&addr).serve(app.into_make_service()).with_graceful_shutdown(wait_for_shutdown_signal(send)) => {}

        _ = recv => {
            tracing::info!("graceful shutdown has timed out. forcing shutdown.");
        }
    }
}

async fn wait_for_shutdown_signal(force_shutdown_tx: oneshot::Sender<()>) {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install terminate signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    tracing::info!("exit signal received, trying graceful shutdown");

    // workaround for https://github.com/hyperium/hyper/issues/2787
    tokio::spawn(async {
        tokio::time::sleep(Duration::from_secs(3)).await;
        force_shutdown_tx.send(()).unwrap();
    });
}

type FirestoreProvider = Firestore;
type GcsProvider = Gcs;
type OtpProvider = Otp;
type PubSubProvider = PubSub;

async fn firestore_provider() -> FirestoreProvider {
    let project_id = envvar_str("PROJECT_ID", None);

    Firestore::new(project_id).await
}

async fn gcs_provider() -> GcsProvider {
    let bucket = envvar_str("BUCKET", None);

    Gcs::new(bucket).await
}

fn otp_provider() -> OtpProvider {
    let origin = envvar_str("ORIGIN", None);
    let url = envvar_str("IMAGE_URL", None);
    let bucket = envvar_str("BUCKET", None);

    Otp::new(origin, url, bucket)
}

async fn pubsub_provider() -> PubSubProvider {
    let cluster = envvar("CLUSTER", None);
    let clustering_topic = envvar_str("CLUSTERING_TOPIC", None);
    let merge_topic = envvar_str("MERGE_TOPIC", None);
    let notification_topic = envvar_str("NOTIFICATION_TOPIC", None);

    PubSub::new(cluster, clustering_topic, merge_topic, notification_topic).await
}

cfg_if! {
    if #[cfg(feature = "email_sg")] {
        use repaint_server_sg::SendGrid;

        type EmailProvider = SendGrid;

        fn email_provider() -> EmailProvider {
            let api_key = envvar_str("SENDGRID_API_KEY", None);
            let send_from = envvar_str("SENDGRID_SEND_FROM", None);
            let url = envvar_str("SENDGRID_URL", None);

            SendGrid::new(api_key, send_from, url)
        }
    } else if #[cfg(feature = "email_gmail")] {
        use repaint_server_gmail::Gmail;

        type EmailProvider = Gmail;

        fn email_provider() -> EmailProvider {
            let send_from = envvar_str("GMAIL_SEND_FROM", None);
            let url = envvar_str("GMAIL_URL", None);
            let username = envvar_str("SMTP_USERNAME", None);
            let password = envvar_str("SMTP_PASSWORD", None);

            Gmail::new(send_from, url, username, password)
        }
    } else {
        compile_error!("you must set one email provider");
    }
}

```

### embed

https://re-taro.dev

https://www.youtube.com/watch?v=SHkF48SgiSA

https://docs.google.com/presentation/d/1Jx4nQbzFk5BYTTZwuOMGQOd359G_orJU-OrG4Bg3ohg/edit?usp=sharing

### design

ToC は [しゅんちゃん](https://twitter.com/shun_shobon) の [ブログ](https://blog.s2n.tech) を参考にした。
