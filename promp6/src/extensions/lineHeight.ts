import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'listItem'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands, editor }) => {
          const { selection } = editor.state;
          const { empty } = selection;

          if (empty) {
            return commands.updateAttributes('paragraph', { lineHeight });
          }

          return commands.command(({ tr, state }) => {
            const { from, to } = state.selection;
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  lineHeight,
                });
              }
            });
            return true;
          });
        },
      unsetLineHeight:
        () =>
        ({ commands, editor }) => {
          const { selection } = editor.state;
          const { empty } = selection;

          if (empty) {
            return commands.updateAttributes('paragraph', { lineHeight: null });
          }

          return commands.command(({ tr, state }) => {
            const { from, to } = state.selection;
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  lineHeight: null,
                });
              }
            });
            return true;
          });
        },
    };
  },
});
