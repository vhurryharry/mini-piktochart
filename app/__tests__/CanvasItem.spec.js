import { mount } from "@vue/test-utils";
import { shallowReactive } from "vue";
import CanvasItem from "../src/components/CanvasItem.vue";

describe("CanvasItem.vue", () => {
  it("renders the correct content for text items", () => {
    const item = { id: 1, type: "text", content: "Hello World", x: 0, y: 0 };
    const wrapper = mount(CanvasItem, {
      props: { item },
    });

    expect(wrapper.text()).toContain("Hello World");
  });

  it("renders an image for image items", () => {
    const item = { id: 2, type: "image", src: "image.png", x: 0, y: 0 };
    const wrapper = mount(CanvasItem, {
      props: { item },
    });

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("image.png");
  });

  it("emits a delete event when the delete button is clicked", async () => {
    const item = { id: 3, type: "text", content: "Delete Me", x: 0, y: 0 };
    const wrapper = mount(CanvasItem, {
      props: { item },
    });

    const deleteButton = wrapper.find("button");
    await deleteButton.trigger("click");

    expect(wrapper.emitted("delete")).toBeTruthy();
    expect(wrapper.emitted("delete")[0]).toEqual([3]);
  });

  it("updates position when dragged within boundaries", async () => {
    // Make the item reactive
    const item = shallowReactive({
      id: 4,
      type: "text",
      content: "Drag Me",
      x: 0,
      y: 0,
    });
    const wrapper = mount(CanvasItem, {
      props: { item },
    });

    const canvasContent = document.createElement("div");
    canvasContent.classList.add("canvas-content");
    document.body.appendChild(canvasContent);

    // Mock the canvas and item dimensions
    vi.spyOn(canvasContent, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 500,
      height: 500,
    });

    vi.spyOn(wrapper.element, "getBoundingClientRect").mockReturnValue({
      width: 50,
      height: 50,
    });

    // Simulate dragging
    await wrapper.trigger("mousedown", { offsetX: 10, offsetY: 10 });
    await window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 100 })
    );
    await window.dispatchEvent(new MouseEvent("mouseup"));

    // Assert the updated position
    expect(item.x).toBe(90); // Adjusted for offset
    expect(item.y).toBe(90);
  });
});
