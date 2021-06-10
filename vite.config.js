import vue from "@vitejs/plugin-vue";

export default {
	root: "demo",
	base: "/",
	optimizeDeps: {
		include: ["json2mq", "primevue/toolbar", "prismjs"],
	},
	assetsDir: "",
	plugins: [vue()],
};
