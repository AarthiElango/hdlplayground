
module dff (
    input  wire clk,
    input  wire d,
    input  wire rst,     // active-high synchronous reset
    output reg  q
);

always @(posedge clk) begin
    if (rst)
        q <= 1'b0;
    else
        q <= d;
end

endmodule
