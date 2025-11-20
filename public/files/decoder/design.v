module decoder_3to8(
  input  wire A0, A1, A2, EN,
  output reg [7:0] D
);
  
always @(*) begin
  if (!EN)
    D = 8'b00000000;
  else
    case ({A2, A1, A0})
      3'b000: D = 8'b00000001;
      3'b001: D = 8'b00000010;
      3'b010: D = 8'b00000100;
      3'b011: D = 8'b00001000;
      3'b100: D = 8'b00010000;
      3'b101: D = 8'b00100000;
      3'b110: D = 8'b01000000;
      3'b111: D = 8'b10000000;
      default: D = 8'b00000000;
    endcase
end
endmodule