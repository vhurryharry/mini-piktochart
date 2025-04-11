import { mount } from "@vue/test-utils";
import CanvasItem from "../src/components/CanvasItem.vue";

describe("CanvasItem.vue", () => {
  // We'll create a container to simulate the canvas area
  let canvasContent;

  beforeEach(() => {
    // Create and append a fake canvas-content parent element.
    canvasContent = document.createElement("div");
    canvasContent.className = "canvas-content";
    // Style dimensions for boundary calculations.
    Object.assign(canvasContent.style, {
      position: "relative",
      width: "500px",
      height: "300px",
    });
    // Stub the getBoundingClientRect for the canvas-content.
    canvasContent.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 500,
      height: 300,
    });
    document.body.appendChild(canvasContent);
  });

  afterEach(() => {
    // Clean up the appended canvasContent element.
    if (canvasContent && canvasContent.parentNode) {
      canvasContent.parentNode.removeChild(canvasContent);
    }
    // Also remove any window event listeners if needed.
    vi.restoreAllMocks();
  });

  it("renders text content for text type item", () => {
    const item = { id: 1, type: "text", content: "Hello World", x: 50, y: 50 };
    const wrapper = mount(CanvasItem, {
      props: { item },
    });
    // Check that the rendered text is present.
    expect(wrapper.text()).toContain("Hello World");
  });

  it("renders image element for image type item", () => {
    const item = { id: 2, type: "image", src: "img.png", x: 0, y: 0 };
    const wrapper = mount(CanvasItem, {
      props: { item },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("img.png");
  });

  it("emits delete event when the delete button is clicked", async () => {
    const item = { id: 3, type: "text", content: "Delete me", x: 0, y: 0 };
    const wrapper = mount(CanvasItem, {
      props: { item },
    });
    const deleteButton = wrapper.find("button.delete-btn");
    await deleteButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("delete");
    expect(wrapper.emitted("delete")[0]).toEqual([item.id]);
  });

  it("updates item position on drag", async () => {
    // Set up an item with initial position.
    const item = { id: 4, type: "text", content: "Drag me", x: 0, y: 0 };
    // Mount the component inside our canvasContent parent.
    const wrapper = mount(CanvasItem, {
      props: { item },
      attachTo: canvasContent, // attach to our fake canvas container
    });

    // Get the canvas-item element.
    const canvasItemEl = wrapper.find(".canvas-item").element;

    // Stub the getBoundingClientRect for the canvas-item
    // Assume the item has a width of 100 and height of 50.
    canvasItemEl.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 100,
      height: 50,
    });

    // Simulate mousedown on the canvas-item.
    // Provide offsetX and offsetY that might come from a real event.
    const mousedownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      clientX: 20,
      clientY: 20,
    });
    // To simulate the offset values, we add them to the event object.
    Object.defineProperty(mousedownEvent, "offsetX", { value: 10 });
    Object.defineProperty(mousedownEvent, "offsetY", { value: 10 });
    // Dispatch the event on the canvas-item element.
    canvasItemEl.dispatchEvent(mousedownEvent);

    // Simulate mousemove event.
    // Calculate a new position:
    // newX = clientX - canvas.left - offsetX.
    // For example, let clientX be 200 and clientY be 150.
    const mousemoveEvent = new MouseEvent("mousemove", {
      bubbles: true,
      clientX: 200,
      clientY: 150,
    });
    window.dispatchEvent(mousemoveEvent);

    // At this point, newX = 200 - 0 - 10 = 190
    // and newY = 150 - 0 - 10 = 140.
    expect(item.x).toBe(190);
    expect(item.y).toBe(140);

    // Simulate mouseup to remove the listeners.
    const mouseupEvent = new MouseEvent("mouseup", { bubbles: true });
    window.dispatchEvent(mouseupEvent);

    // Dispatch another mousemove event to confirm that no further changes occur.
    const newXBefore = item.x;
    const newYBefore = item.y;
    const anotherMoveEvent = new MouseEvent("mousemove", {
      bubbles: true,
      clientX: 300,
      clientY: 250,
    });
    window.dispatchEvent(anotherMoveEvent);
    // The values should remain unchanged.
    expect(item.x).toBe(newXBefore);
    expect(item.y).toBe(newYBefore);
  });
});
