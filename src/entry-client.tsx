// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";
import type { MountableElement } from "solid-js/web";

const app = document.querySelector("#re-taro") as MountableElement;

mount(() => <StartClient />, app);
