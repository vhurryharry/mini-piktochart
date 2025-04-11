import { mount, flushPromises } from "@vue/test-utils";
import Sidebar from "../src/components/Sidebar.vue";
import Uploader from "../src/components/Uploader.vue";
import TextInput from "../src/components/TextInput.vue";
import ImageList from "../src/components/ImageList.vue";

vi.mock("@/components/Uploader.vue", () => ({
  default: {
    name: "Uploader",
    template: "<div />",
  },
}));

vi.mock("@/components/TextInput.vue", () => ({
  default: {
    name: "TextInput",
    template: "<div />",
  },
}));

vi.mock("@/components/ImageList.vue", () => ({
  default: {
    name: "ImageList",
    props: ["images"],
    template: "<div />",
  },
}));

describe("Sidebar.vue", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(["img1.png", "img2.png"]),
      })
    );
  });

  it("renders Sidebar and fetches images", async () => {
    const wrapper = mount(Sidebar);
    await flushPromises();

    expect(fetch).toHaveBeenCalledWith("/images");
    expect(wrapper.vm.images).toEqual(["img1.png", "img2.png"]);
  });

  it("handles uploaded event from Uploader", async () => {
    const wrapper = mount(Sidebar);
    await flushPromises();

    const uploader = wrapper.findComponent(Uploader);
    await uploader.vm.$emit("uploaded");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("emits add-text when TextInput emits add", async () => {
    const wrapper = mount(Sidebar);
    const textInput = wrapper.findComponent(TextInput);
    await textInput.vm.$emit("add", "test text");

    expect(wrapper.emitted("add-text")).toBeTruthy();
    expect(wrapper.emitted("add-text")[0]).toEqual(["test text"]);
  });

  it("emits add-image when ImageList emits select-image", async () => {
    const wrapper = mount(Sidebar);
    const imageList = wrapper.findComponent(ImageList);
    await imageList.vm.$emit("select-image", "img1.png");

    expect(wrapper.emitted("add-image")).toBeTruthy();
    expect(wrapper.emitted("add-image")[0]).toEqual(["img1.png"]);
  });
});
